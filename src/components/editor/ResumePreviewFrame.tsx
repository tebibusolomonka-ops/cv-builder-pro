'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import type { PersonalFieldKey, SectionType } from '@/types/resume'

export const A4_WIDTH = 794
export const A4_HEIGHT = 1123

/**
 * The optional sections a reader may take off the page from the preview.
 *
 * Only these four. The summary, work experience, education and skills are what
 * a CV is, so they get no remove control -- nobody should be one stray click
 * away from deleting their work history.
 */
const SECTION_LABELS: Record<string, string> = {
  personal: 'Personal information',
  summary: 'About me',
  workExperience: 'Work experience',
  education: 'Education and training',
  skills: 'Digital and professional skills',
  languages: 'Languages',
  certifications: 'Certifications',
  projects: 'Projects',
  awards: 'Honours and awards',
  volunteer: 'Volunteering',
  hobbies: 'Hobbies and interests',
  organisationalSkills: 'Organisational and leadership skills',
  references: 'References',
}

const REMOVABLE = new Set(Object.keys(SECTION_LABELS).filter((kind) => kind !== 'personal'))

type Spot = { kind: string; top: number; left: number; width: number; height: number }
type ContactSpot = { field: PersonalFieldKey; top: number; left: number; width: number; height: number }

const CONTACT_LABELS: Record<PersonalFieldKey, string> = {
  profilePhoto: 'profile photo',
  email: 'email address',
  phone: 'phone number',
  location: 'location',
  website: 'website',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  dateOfBirth: 'date of birth',
  nationality: 'nationality',
  gender: 'gender',
  drivingLicence: 'driving licence',
  passportNumber: 'passport number',
  placeOfBirth: 'place of birth',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
}

/**
 * Older layouts predate data-cv-section tags and use dozens of visual heading
 * components. Recognise their reader-facing titles so every template gets the
 * same paper-to-editor interaction without coupling the frame to 52 renderers.
 */
function kindFromHeading(text: string): string | null {
  const title = text.trim().toLowerCase().replace(/[^a-z& ]/g, ' ').replace(/\s+/g, ' ')
  if (!title) return null
  if (/^contact( info)?$/.test(title)) return 'personal'
  if (/^(about|about me|profile|professional profile|professional summary|summary|objective)$/.test(title)) return 'summary'
  if (/(work|professional|career|employment).*experience|experience|employment history|career history|earlier roles/.test(title)) return 'workExperience'
  if (/education|academic|qualification|training/.test(title)) return 'education'
  if (/language/.test(title)) return 'languages'
  if (/certificate|certification/.test(title)) return 'certifications'
  if (/project/.test(title)) return 'projects'
  if (/reference/.test(title)) return 'references'
  if (/honour|honor|award|achievement/.test(title)) return 'awards'
  if (/volunteer/.test(title)) return 'volunteer'
  if (/hobbies|interests/.test(title)) return 'hobbies'
  if (/leadership|organisation|organization|management/.test(title)) return 'organisationalSkills'
  if (/skill|expertise|competenc|toolkit|capabilit/.test(title)) return 'skills'
  return null
}

/**
 * Scales the fixed-size A4 resume page to fit its container width.
 * The frame's layout box matches the scaled size, so no dead space
 * or horizontal overflow is left behind by the CSS transform.
 */
export function ResumePreviewFrame({
  children,
  onEditSection,
}: {
  children: React.ReactNode
  onEditSection?: (kind: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)
  // A European CV runs to two or three sheets, so the frame can no longer
  // assume it is wrapping exactly one A4. It measures what was actually
  // rendered; single-sheet templates simply measure one page and are
  // unaffected.
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT)
  const [spot, setSpot] = useState<Spot | null>(null)
  const [contactSpot, setContactSpot] = useState<ContactSpot | null>(null)
  const hideSection = useResumeStore((state) => state.hideSection)
  const hidePersonalField = useResumeStore((state) => state.hidePersonalField)

  const measure = useCallback(() => {
    const el = containerRef.current
    // Width is 0 while the panel is hidden (mobile edit tab) — keep the last scale
    if (el && el.clientWidth > 0) setScale(Math.min(1, el.clientWidth / A4_WIDTH))
    // Measured here rather than through a ResizeObserver on the stack: the
    // commit-time pass below already runs after every render, so it sees the
    // extra sheets the moment pagination adds them. React bails out when the
    // value is unchanged, so this cannot loop.
    const sheet = sheetRef.current
    if (sheet && sheet.scrollHeight > 0) setContentHeight(sheet.scrollHeight)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // Re-measure after every commit so the mobile edit/preview tab switch
  // (display: none -> flex) picks up the new width immediately.
  useEffect(() => {
    measure()
  })

  /**
   * The on-screen box for one section.
   *
   * A section is not always a single element: the layouts that write a heading
   * and its body as two siblings tag both, so the box is the union of every
   * element carrying this name. Zero-sized nodes are skipped so an empty
   * wrapper cannot drag the box up to the top of the page.
   */
  const locate = useCallback((kind: string): Spot | null => {
    const container = containerRef.current
    if (!container) return null
    const nodes = container.querySelectorAll(`[data-cv-section="${kind}"]`)
    const inferredHeadings = nodes.length === 0
      ? Array.from(container.querySelectorAll('h1, h2, h3, [role="heading"]')).filter((node) => {
          if (kind === 'personal' && node.tagName === 'H1') return true
          return kindFromHeading(node.textContent ?? '') === kind
        })
      : []
    if (nodes.length === 0 && inferredHeadings.length === 0) return null
    const base = container.getBoundingClientRect()
    let top = Infinity, left = Infinity, right = -Infinity, bottom = -Infinity
    const locatedNodes = nodes.length > 0 ? Array.from(nodes) : inferredHeadings
    locatedNodes.forEach((node) => {
      const r = node.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      top = Math.min(top, r.top)
      left = Math.min(left, r.left)
      right = Math.max(right, r.right)
      bottom = Math.max(bottom, r.bottom)
    })
    if (!Number.isFinite(top)) return null
    return { kind, top: top - base.top, left: left - base.left, width: right - left, height: bottom - top }
  }, [])

  const inferKind = useCallback((target: HTMLElement | null): string | null => {
    if (!target) return null
    const tagged = target.closest('[data-cv-section]')?.getAttribute('data-cv-section')
    if (tagged && tagged in SECTION_LABELS) return tagged

    const directHeading = target.closest('h1, h2, h3, [role="heading"]')
    if (directHeading?.tagName === 'H1') return 'personal'
    const directKind = kindFromHeading(directHeading?.textContent ?? '')
    if (directKind) return directKind

    // When the pointer is over section content rather than its title, choose
    // the nearest mapped heading above it in the same horizontal column.
    const targetRect = target.getBoundingClientRect()
    const targetX = targetRect.left + targetRect.width / 2
    const targetY = targetRect.top + targetRect.height / 2
    let bestKind: string | null = null
    let bestDistance = Infinity
    sheetRef.current?.querySelectorAll('h1, h2, h3, [role="heading"]').forEach((heading) => {
      const kind = heading.tagName === 'H1' ? 'personal' : kindFromHeading(heading.textContent ?? '')
      if (!kind || !(kind in SECTION_LABELS)) return
      const rect = heading.getBoundingClientRect()
      const horizontallyAligned = targetX >= rect.left - 40 && targetX <= rect.right + 260
      if (!horizontallyAligned || rect.top > targetY + 8) return
      const distance = targetY - rect.top
      if (distance < bestDistance) {
        bestKind = kind
        bestDistance = distance
      }
    })
    return bestKind
  }, [])

  const locateContact = useCallback((target: HTMLElement | null): ContactSpot | null => {
    const container = containerRef.current
    const sheet = sheetRef.current
    if (!container || !sheet || !target) return null

    const tagged = target.closest<HTMLElement>('[data-cv-contact]')
    let field = tagged?.dataset.cvContact as PersonalFieldKey | undefined
    let node = tagged

    // Older layouts do not carry contact tags. Match the exact rendered value
    // instead, using the preview model embedded on its display:contents root.
    if (!field) {
      const mapNode = sheet.querySelector<HTMLElement>('[data-cv-contact-map]')
      const rawMap = mapNode?.dataset.cvContactMap
      if (!rawMap) return null
      const map = JSON.parse(rawMap) as Partial<Record<PersonalFieldKey, string[]>>
      let candidate: HTMLElement | null = target
      while (candidate && candidate !== sheet) {
        const text = candidate.textContent?.trim() ?? ''
        const match = (Object.entries(map) as [PersonalFieldKey, string[]][]).find(([, values]) =>
          values.some((value) => value && value.trim() === text)
        )
        if (match) {
          field = match[0]
          node = candidate
          break
        }
        candidate = candidate.parentElement
      }
    }

    if (!field || !node || !(field in CONTACT_LABELS)) return null
    const rect = node.getBoundingClientRect()
    const base = container.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    return {
      field,
      top: rect.top - base.top,
      left: rect.left - base.left,
      width: rect.width,
      height: rect.height,
    }
  }, [])

  const handleMove = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement | null
      // Moving onto the remove button must not count as leaving the section,
      // or the button would vanish before it could be clicked.
      if (target?.closest('[data-cv-overlay]')) return
      const contact = locateContact(target)
      if (contact) {
        setContactSpot(contact)
        setSpot(null)
        return
      }
      setContactSpot(null)
      const kind = inferKind(target)
      setSpot(kind && kind in SECTION_LABELS ? locate(kind) : null)
    },
    [inferKind, locate, locateContact]
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[850px]"
      onMouseMove={handleMove}
      onMouseLeave={() => {
        setSpot(null)
        setContactSpot(null)
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement | null)?.closest('[data-cv-overlay]')) return
        const kind = inferKind(event.target as HTMLElement | null)
        if (kind && kind in SECTION_LABELS) onEditSection?.(kind)
      }}
    >
      <div
        className="resume-print-frame mx-auto overflow-hidden rounded-lg bg-white shadow-2xl transition-shadow duration-300 hover:shadow-glow-cyan"
        style={{
          width: scale === null ? '100%' : A4_WIDTH * scale,
          height: scale === null ? 'auto' : contentHeight * scale,
          visibility: scale === null ? 'hidden' : 'visible',
        }}
      >
        <div
          ref={sheetRef}
          style={{
            width: A4_WIDTH,
            transform: `scale(${scale ?? 1})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>

      {/*
        Drawn as a sibling of the printed frame rather than inside it, so it can
        never reach the PDF: the exporter renders .resume-print-frame, and this
        is not part of it.
      */}
      {spot ? (
        <div
          data-cv-overlay
          className="no-print pointer-events-none absolute z-20"
          style={{ top: spot.top - 4, left: spot.left - 4, width: spot.width + 8, height: spot.height + 8 }}
        >
          <div className="absolute inset-0 rounded-md ring-2 ring-primary-500/70" />
          <button
            type="button"
            aria-label={`Edit ${SECTION_LABELS[spot.kind]}`}
            title={`Edit ${SECTION_LABELS[spot.kind]}`}
            onClick={() => onEditSection?.(spot.kind)}
            className="pointer-events-auto absolute -left-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-black/30 transition-colors hover:bg-primary-500"
          >
            <Pencil size={13} strokeWidth={2.5} />
          </button>
          {REMOVABLE.has(spot.kind) ? (
          <button
            type="button"
            aria-label={`Remove the ${SECTION_LABELS[spot.kind]} section`}
            title={`Remove ${SECTION_LABELS[spot.kind]}`}
            onClick={() => {
              hideSection(spot.kind as SectionType)
              setSpot(null)
            }}
            className="pointer-events-auto absolute -right-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-black/30 transition-colors hover:bg-primary-500"
          >
            <X size={13} strokeWidth={3} />
          </button>
          ) : null}
        </div>
      ) : null}
      {contactSpot ? (
        <div
          data-cv-overlay
          className="no-print pointer-events-none absolute z-30"
          style={{
            top: contactSpot.top - 2,
            left: contactSpot.left - 2,
            width: contactSpot.width + 4,
            height: contactSpot.height + 4,
          }}
        >
          <div className="absolute inset-0 rounded ring-1 ring-primary-500/70" />
          <button
            type="button"
            aria-label={`Remove ${CONTACT_LABELS[contactSpot.field]} from CV`}
            title={`Remove ${CONTACT_LABELS[contactSpot.field]}`}
            onClick={() => {
              hidePersonalField(contactSpot.field)
              setContactSpot(null)
            }}
            className="pointer-events-auto absolute -right-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-black/30 transition-colors hover:bg-primary-500"
          >
            <X size={13} strokeWidth={3} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
