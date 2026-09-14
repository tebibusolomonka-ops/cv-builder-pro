'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export const A4_WIDTH = 794
export const A4_HEIGHT = 1123

/**
 * Scales the fixed-size A4 resume page to fit its container width.
 * The frame's layout box matches the scaled size, so no dead space
 * or horizontal overflow is left behind by the CSS transform.
 */
export function ResumePreviewFrame({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)

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

  return (
    <div ref={containerRef} className="w-full max-w-[850px]">
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
    </div>
  )
}
