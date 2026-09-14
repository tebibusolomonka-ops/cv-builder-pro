'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { Input } from '@/components/ui'
import { User, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import NextImage from 'next/image'

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

export function PersonalInfoForm() {
  const { data, setPersonalInfo } = useResumeStore()
  const info = data.personalInfo

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
        </div>
      </div>
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
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={info.email}
          onChange={handleChange}
          placeholder="e.g. john@example.com"
          leftIcon={<Mail size={18} />}
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={info.phone}
          onChange={handleChange}
          placeholder="e.g. +1 234 567 890"
          leftIcon={<Phone size={18} />}
        />
        <Input
          label="Location"
          name="location"
          value={info.location}
          onChange={handleChange}
          placeholder="e.g. San Francisco, CA"
          leftIcon={<MapPin size={18} />}
        />
        <Input
          label="Website / Portfolio"
          name="website"
          type="url"
          value={info.website}
          onChange={handleChange}
          placeholder="e.g. https://johndoe.com"
          leftIcon={<LinkIcon size={18} />}
        />
        <Input
          label="LinkedIn URL"
          name="linkedin"
          type="url"
          value={info.linkedin}
          onChange={handleChange}
          placeholder="e.g. linkedin.com/in/johndoe"
          leftIcon={<FaLinkedin size={18} />}
        />
        <Input
          label="GitHub URL"
          name="github"
          type="url"
          value={info.github}
          onChange={handleChange}
          placeholder="e.g. github.com/johndoe"
          leftIcon={<FaGithub size={18} />}
        />
      </div>
    </div>
  )
}
