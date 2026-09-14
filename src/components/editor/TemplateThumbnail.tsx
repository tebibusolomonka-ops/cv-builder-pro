'use client'

import { useEffect, useRef, useState } from 'react'
import { LiveResumePreview } from './LiveResumePreview'
import { A4_HEIGHT, A4_WIDTH } from './ResumePreviewFrame'

/**
 * Renders the real resume template (with sample content) scaled down
 * to fill its parent box, so gallery cards show exactly what the
 * editor will produce. Mounts lazily to keep long template lists fast.
 */
export function TemplateThumbnail({ templateId, eager = false, sample = true }: { templateId: string; eager?: boolean; sample?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)
  const [visible, setVisible] = useState(eager)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      if (el.clientWidth > 0) setScale(el.clientWidth / A4_WIDTH)
    }
    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(el)

    let intersectionObserver: IntersectionObserver | undefined
    if (!eager) {
      // Synchronous first check: IntersectionObserver fires asynchronously,
      // so mount anything already near the viewport right away.
      const rect = el.getBoundingClientRect()
      if (typeof IntersectionObserver === 'undefined' || rect.top < window.innerHeight + 600) {
        setVisible(true)
      } else {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              setVisible(true)
              intersectionObserver?.disconnect()
            }
          },
          { rootMargin: '300px' }
        )
        intersectionObserver.observe(el)
      }
    }

    return () => {
      resizeObserver.disconnect()
      intersectionObserver?.disconnect()
    }
  }, [eager])

  return (
    <div ref={containerRef} className="pointer-events-none relative h-full w-full select-none overflow-hidden bg-white" aria-hidden>
      {visible && scale !== null && (
        <div
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <LiveResumePreview templateId={templateId} forceSample={sample} />
        </div>
      )}
    </div>
  )
}
