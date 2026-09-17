'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import type { SectionType } from '@/types/resume'

export const A4_WIDTH = 794
export const A4_HEIGHT = 1123

/**
 * The optional sections a reader may take off the page from the preview.
 *
 * Only these four. The summary, work experience, education and skills are what
 * a CV is, so they get no remove control -- nobody should be one stray click
 * away from deleting their work history.
 */
const REMOVABLE: Record<string, string> = {
  languages: 'Languages',
  certifications: 'Certifications',
  projects: 'Projects',
  references: 'References',
}

type Spot = { kind: string; top: number; left: number; width: number; height: number }

/**
 * Scales the fixed-size A4 resume page to fit its container width.
 * The frame's layout box matches the scaled size, so no dead space
 * or horizontal overflow is left behind by the CSS transform.
 */
export function ResumePreviewFrame({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)
  const [spot, setSpot] = useState<Spot | null>(null)
  const hideSection = useResumeStore((state) => state.hideSection)

  const measure = useCallback(() => {
    const el = containerRef.current
    // Width is 0 while the panel is hidden (mobile edit tab) — keep the last scale
    if (el && el.clientWidth > 0) setScale(Math.min(1, el.clientWidth / A4_WIDTH))
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
    if (nodes.length === 0) return null
    const base = container.getBoundingClientRect()
    let top = Infinity, left = Infinity, right = -Infinity, bottom = -Infinity
    nodes.forEach((node) => {
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

  const handleMove = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement | null
      // Moving onto the remove button must not count as leaving the section,
      // or the button would vanish before it could be clicked.
      if (target?.closest('[data-cv-overlay]')) return
      const host = target?.closest('[data-cv-section]')
      const kind = host?.getAttribute('data-cv-section')
      setSpot(kind && kind in REMOVABLE ? locate(kind) : null)
    },
    [locate]
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[850px]"
      onMouseMove={handleMove}
      onMouseLeave={() => setSpot(null)}
    >
      <div
        className="resume-print-frame mx-auto overflow-hidden rounded-lg bg-white shadow-2xl transition-shadow duration-300 hover:shadow-glow-cyan"
        style={{
          width: scale === null ? '100%' : A4_WIDTH * scale,
          height: scale === null ? 'auto' : A4_HEIGHT * scale,
          visibility: scale === null ? 'hidden' : 'visible',
        }}
      >
        <div
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
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
            aria-label={`Remove the ${REMOVABLE[spot.kind]} section`}
            title={`Remove ${REMOVABLE[spot.kind]}`}
            onClick={() => {
              hideSection(spot.kind as SectionType)
              setSpot(null)
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
