'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const TemplateSpotlight = dynamic(
  () => import('./TemplateSpotlight').then((module) => module.TemplateSpotlight),
  { ssr: false }
)

/**
 * The live template carousel pulls in the full resume renderer. Keep that large
 * editor code out of the homepage's initial work and load it shortly before the
 * visitor scrolls to the carousel.
 */
export function DeferredTemplateSpotlight() {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const placeholder = placeholderRef.current
    if (!placeholder || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '500px 0px' }
    )
    observer.observe(placeholder)
    return () => observer.disconnect()
  }, [])

  if (shouldLoad) return <TemplateSpotlight />

  return (
    <div
      ref={placeholderRef}
      className="min-h-[900px] border-y border-dark-800/40 bg-surface"
      aria-hidden="true"
    />
  )
}
