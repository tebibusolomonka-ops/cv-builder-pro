'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { useTemplateFields } from './useTemplateFields'
import { Input } from '@/components/ui'
import { User, Mail, Phone, MapPin, Link as LinkIcon, CalendarDays, Car, Flag, UserRound, BookUser, MapPinned, MessageCircle, EyeOff, RotateCcw } from 'lucide-react'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import NextImage from 'next/image'
import type { PersonalFieldKey } from '@/types/resume'
import type { ReactNode } from 'react'

const MAX_SOURCE_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_SOURCE_IMAGE_PIXELS = 40_000_000
const MAX_PROFILE_DATA_URL_LENGTH = 600_000
const PROFILE_IMAGE_SIZES = [800, 640, 512, 400, 320]
const LOSSY_QUALITIES = [0.84, 0.74, 0.64]
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

type ImageEncoding = {
  type: 'image/jpeg' | 'image/png' | 'image/webp'
  quality?: number
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Could not read that image file.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read that image file.'))
    reader.onabort = () => reject(new Error('Image loading was cancelled.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('That file is not a readable image.'))
    image.src = dataUrl
  })
}

function renderImage(
  image: HTMLImageElement,
  maxDimension: number,
  background?: string
) {
  const largestSide = Math.max(image.naturalWidth, image.naturalHeight)
  const scale = Math.min(1, maxDimension / largestSide)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))

  const context = canvas.getContext('2d')
  if (!context) throw new Error('This browser could not resize the image.')

  if (background) {
    context.fillStyle = background
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

function encodeCanvas(canvas: HTMLCanvasElement, encoding: ImageEncoding) {
  const dataUrl = canvas.toDataURL(encoding.type, encoding.quality)

  // Browsers that do not support WebP may silently return PNG instead.
  if (!dataUrl.startsWith(`data:${encoding.type};`)) return null
  return dataUrl
}

function encodeWithinLimit(
  image: HTMLImageElement,
  encodings: ImageEncoding[],
  background?: string
) {
  if (encodings.length === 0) return null

  const renderedSizes = new Set<string>()

  for (const maxDimension of PROFILE_IMAGE_SIZES) {
    const canvas = renderImage(image, maxDimension, background)
    const renderedSize = `${canvas.width}x${canvas.height}`
    if (renderedSizes.has(renderedSize)) continue
    renderedSizes.add(renderedSize)

    for (const encoding of encodings) {
      const dataUrl = encodeCanvas(canvas, encoding)
      if (dataUrl && dataUrl.length <= MAX_PROFILE_DATA_URL_LENGTH) return dataUrl
    }
  }

  return null
}

async function prepareProfilePhoto(file: File) {
  const imageType = file.type.toLowerCase()
  if (!SUPPORTED_IMAGE_TYPES.has(imageType)) {
    throw new Error('Choose a JPEG, PNG, or WebP image.')
  }
  if (file.size === 0) throw new Error('That image file is empty.')
  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error('Choose an image smaller than 10 MB.')
  }

  const source = await readImageFile(file)
  const image = await loadImage(source)
  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error('That image has invalid dimensions.')
  }
  if (image.naturalWidth * image.naturalHeight > MAX_SOURCE_IMAGE_PIXELS) {
    throw new Error('That image has too many pixels. Choose a smaller photo.')
  }

  // PNG and WebP can contain transparency. Prefer PNG/WebP encodings at
  // progressively smaller dimensions before falling back to a white-backed JPEG.
  const alphaSafeEncodings: ImageEncoding[] =
    imageType === 'image/png'
      ? [
          { type: 'image/png' },
          ...LOSSY_QUALITIES.map((quality) => ({ type: 'image/webp' as const, quality })),
        ]
      : imageType === 'image/webp'
        ? LOSSY_QUALITIES.map((quality) => ({ type: 'image/webp' as const, quality }))
        : []

  const transparencySafe = encodeWithinLimit(image, alphaSafeEncodings)
  if (transparencySafe) return transparencySafe

  const jpegEncodings: ImageEncoding[] = LOSSY_QUALITIES.map((quality) => ({
    type: 'image/jpeg',
    quality,
  }))
  const jpeg = encodeWithinLimit(image, jpegEncodings, '#ffffff')
  if (jpeg) return jpeg

  throw new Error('The image could not be compressed enough. Choose a simpler photo.')
}

const PERSONAL_FIELD_LABELS: Record<PersonalFieldKey, string> = {
  profilePhoto: 'Profile photo',
  email: 'Email address',
  phone: 'Phone number',
  location: 'Location',
  website: 'Website / portfolio',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  dateOfBirth: 'Date of birth',
  nationality: 'Nationality',
  gender: 'Gender',
  drivingLicence: 'Driving licence',
  passportNumber: 'Passport number',
  placeOfBirth: 'Place of birth',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
}

function RemovablePersonalField({
  field,
  hidden,
  onRemove,
  children,
}: {
  field: PersonalFieldKey
  hidden: Set<PersonalFieldKey>
  onRemove: (field: PersonalFieldKey) => void
  children: ReactNode
}) {
  if (hidden.has(field)) return null

  return (
    <div className="space-y-1.5">
      {children}
      <button
        type="button"
        onClick={() => onRemove(field)}
        className="inline-flex items-center gap-1 text-xs text-dark-400 transition-colors hover:text-primary-300"
        aria-label={`Remove ${PERSONAL_FIELD_LABELS[field]} from CV`}
      >
        <EyeOff size={13} />
        Remove from CV
      </button>
    </div>
  )
}

export function PersonalInfoForm() {
  const { data, setPersonalInfo, hidePersonalField, restorePersonalField } = useResumeStore()
  const info = data.personalInfo
  const hiddenPersonalFields = new Set(data.hiddenPersonalFields ?? [])
  // Ask only for what the chosen template prints. Name, title, email, phone and
  // location are on every layout, so they are never conditional.
  const { uses } = useTemplateFields()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalInfo({ [name]: value })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const file = input.files?.[0]
    if (!file) return

    try {
      const profilePhoto = await prepareProfilePhoto(file)
      setPersonalInfo({ profilePhoto })
      toast.success('Profile photo optimized and saved')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not process that image.')
    } finally {
      // Selecting the same file again must trigger onChange after an error.
      input.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {uses('photo') && !hiddenPersonalFields.has('profilePhoto') ? (
      <div className="flex items-center gap-4 p-4 bg-dark-800/50 border border-dark-700 rounded-xl">
        <div className="w-16 h-16 rounded-full bg-dark-700 border-2 border-dark-600 flex items-center justify-center overflow-hidden shrink-0">
          {info.profilePhoto ? (
            <NextImage
              src={info.profilePhoto}
              alt="Profile"
              width={64}
              height={64}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <User size={24} className="text-dark-400" />
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="profile-photo" className="block text-sm font-medium text-white mb-1">
            Profile Photo
          </label>
          <input
            id="profile-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            className="block w-full text-sm text-dark-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-500/10 file:text-primary-400
              hover:file:bg-primary-500/20 file:cursor-pointer cursor-pointer"
          />
          <p className="mt-1 text-xs text-dark-400">JPEG, PNG, or WebP up to 10 MB. Photos are resized before saving.</p>
          <button
            type="button"
            onClick={() => hidePersonalField('profilePhoto')}
            className="mt-2 inline-flex items-center gap-1 text-xs text-dark-400 transition-colors hover:text-primary-300"
          >
            <EyeOff size={13} /> Remove photo from CV
          </button>
        </div>
      </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="fullName"
          value={info.fullName}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          leftIcon={<User size={18} />}
        />
        <Input
          label="Job Title"
          name="title"
          value={info.title}
          onChange={handleChange}
          placeholder="e.g. Senior Software Engineer"
        />
        <RemovablePersonalField field="email" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
          label="Email Address"
          name="email"
          type="email"
          value={info.email}
          onChange={handleChange}
          placeholder="e.g. john@example.com"
          leftIcon={<Mail size={18} />}
        /></RemovablePersonalField>
        <RemovablePersonalField field="phone" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={info.phone}
          onChange={handleChange}
          placeholder="e.g. +1 234 567 890"
          leftIcon={<Phone size={18} />}
        /></RemovablePersonalField>
        <RemovablePersonalField field="location" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
          label="Location"
          name="location"
          value={info.location}
          onChange={handleChange}
          placeholder="e.g. San Francisco, CA"
          leftIcon={<MapPin size={18} />}
        /></RemovablePersonalField>
        {uses('website') ? (
        <RemovablePersonalField field="website" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
          label="Website / Portfolio"
          name="website"
          type="url"
          value={info.website}
          onChange={handleChange}
          placeholder="e.g. https://johndoe.com"
          leftIcon={<LinkIcon size={18} />}
        /></RemovablePersonalField>
        ) : null}
        {uses('linkedin') ? (
        <RemovablePersonalField field="linkedin" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
          label="LinkedIn URL"
          name="linkedin"
          type="url"
          value={info.linkedin}
          onChange={handleChange}
          placeholder="e.g. linkedin.com/in/johndoe"
          leftIcon={<FaLinkedin size={18} />}
        /></RemovablePersonalField>
        ) : null}
        {uses('github') ? (
        <RemovablePersonalField field="github" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
          label="GitHub URL"
          name="github"
          type="url"
          value={info.github}
          onChange={handleChange}
          placeholder="e.g. github.com/johndoe"
          leftIcon={<FaGithub size={18} />}
        /></RemovablePersonalField>
        ) : null}
        {uses('dateOfBirth') ? (
          <RemovablePersonalField field="dateOfBirth" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="Date of birth"
            name="dateOfBirth"
            value={info.dateOfBirth ?? ''}
            onChange={handleChange}
            placeholder="e.g. 28/07/1991"
            leftIcon={<CalendarDays size={18} />}
          /></RemovablePersonalField>
        ) : null}
        {uses('nationality') ? (
          <RemovablePersonalField field="nationality" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="Nationality"
            name="nationality"
            value={info.nationality ?? ''}
            onChange={handleChange}
            placeholder="e.g. Ethiopian"
            leftIcon={<Flag size={18} />}
          /></RemovablePersonalField>
        ) : null}
        {uses('gender') ? (
          <RemovablePersonalField field="gender" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="Gender"
            name="gender"
            value={info.gender ?? ''}
            onChange={handleChange}
            placeholder="Leave empty to keep it off your CV"
            leftIcon={<UserRound size={18} />}
          /></RemovablePersonalField>
        ) : null}
        {uses('drivingLicence') ? (
          <RemovablePersonalField field="drivingLicence" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="Driving licence"
            name="drivingLicence"
            value={info.drivingLicence ?? ''}
            onChange={handleChange}
            placeholder="e.g. B"
            leftIcon={<Car size={18} />}
          /></RemovablePersonalField>
        ) : null}
        {uses('passportNumber') ? (
          <RemovablePersonalField field="passportNumber" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="Passport number"
            name="passportNumber"
            value={info.passportNumber ?? ''}
            onChange={handleChange}
            placeholder="Optional"
            leftIcon={<BookUser size={18} />}
          /></RemovablePersonalField>
        ) : null}
        {uses('placeOfBirth') ? (
          <RemovablePersonalField field="placeOfBirth" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="Place of birth"
            name="placeOfBirth"
            value={info.placeOfBirth ?? ''}
            onChange={handleChange}
            placeholder="e.g. Robe, Ethiopia"
            leftIcon={<MapPinned size={18} />}
          /></RemovablePersonalField>
        ) : null}
        {uses('whatsapp') ? (
          <RemovablePersonalField field="whatsapp" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="WhatsApp"
            name="whatsapp"
            value={info.whatsapp ?? ''}
            onChange={handleChange}
            placeholder="e.g. +251 911 234 567"
            leftIcon={<MessageCircle size={18} />}
          /></RemovablePersonalField>
        ) : null}
        {uses('instagram') ? (
          <RemovablePersonalField field="instagram" hidden={hiddenPersonalFields} onRemove={hidePersonalField}><Input
            label="Instagram"
            name="instagram"
            value={info.instagram ?? ''}
            onChange={handleChange}
            placeholder="instagram.com/your-name"
            leftIcon={<FaInstagram size={18} />}
          /></RemovablePersonalField>
        ) : null}
      </div>

      {hiddenPersonalFields.size > 0 ? (
        <div className="rounded-xl border border-dashed border-dark-600 bg-dark-800/35 p-4">
          <p className="text-sm font-medium text-dark-200">Removed from this CV</p>
          <p className="mt-1 text-xs text-dark-400">Your saved values are kept. Restore any detail with one click.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...hiddenPersonalFields].map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => restorePersonalField(field)}
                className="inline-flex items-center gap-1.5 rounded-full border border-dark-600 px-3 py-1.5 text-xs text-dark-200 transition-colors hover:border-primary-400 hover:text-primary-300"
              >
                <RotateCcw size={13} /> Restore {PERSONAL_FIELD_LABELS[field]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {uses('dateOfBirth') ? (
        <p className="text-xs leading-relaxed text-dark-400">
          Date of birth, nationality and gender are normal on a Europass CV and
          are what employers there expect. They are optional here: anything you
          leave empty simply does not appear.
        </p>
      ) : null}
    </div>
  )
}
