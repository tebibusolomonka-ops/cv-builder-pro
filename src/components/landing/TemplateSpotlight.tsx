'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { TEMPLATES, LAYOUT_LABELS } from '@/lib/constants'
import { TemplateThumbnail } from '@/components/editor/TemplateThumbnail'
import { useResumeStore } from '@/store/useResumeStore'

const FLAGSHIP_IDS = [
  'vertex-gold',
  'meridian-navy',
  'crest-burgundy',
  'obsidian-coral',
  'solstice-cobalt',
]

const SLIDE_W = 400
const AUTOPLAY_MS = 5000

export function TemplateSpotlight() {
  const router = useRouter()
  const { resetResume, setTemplate } = useResumeStore()
  // Direction keeps the wraparound exit animation consistent.
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)

  const slides = FLAGSHIP_IDS.map((id) => TEMPLATES.find((t) => t.id === id)).filter(
    (t): t is NonNullable<typeof t> => Boolean(t)
  )
  const count = slides.length

  const go = useCallback(
    (next: number, dir: number) => setSlide([((next % count) + count) % count, dir]),
    [count]
  )

  // Restart autoplay after manual navigation.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (paused || count === 0) return
    timer.current = setTimeout(() => go(index + 1, 1), AUTOPLAY_MS)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [index, paused, count, go])

  const use = (templateId: string) => {
    resetResume()
    setTemplate(templateId)
    router.push(`/resume/new/edit?template=${encodeURIComponent(templateId)}`)
  }

  if (count === 0) return null
  const active = slides[index]

  return (
    <section
      className="landing-section relative overflow-hidden py-24 md:py-32"
      aria-roledescription="carousel"
      aria-label="Flagship resume templates"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,rgba(184,68,46,0.2),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_50%_40%_at_82%_78%,rgba(193,69,47,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-dark-950 via-dark-950/50 to-transparent" />

      <div className="relative">
        <div className="mx-auto mb-14 max-w-3xl px-6 text-center">
          <span className="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.28em] text-primary-400">
            The Collection
          </span>
          <h2 className="font-display mb-5 text-4xl font-bold tracking-tight text-dark-100 md:text-5xl">
            Five designs worth <span className="text-primary-400">applying in</span>
          </h2>
          <p className="text-lg leading-relaxed text-dark-300">
            Our curated set — each a different structure, not the same CV in a new colour. Every
            preview is the real template, rendered live.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative mx-auto grid grid-cols-1 items-center justify-center gap-12 px-6 lg:grid-cols-[210px_400px_210px]">
            <motion.div
              key={`n-${active.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="hidden justify-self-end pr-4 text-right lg:block"
            >
              <p className="font-display text-[120px] leading-[0.8] text-primary-500/20">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-dark-400">
                of {String(count).padStart(2, '0')}
              </p>
              <span className="mt-5 ml-auto block h-px w-16 bg-primary-500/40" />
            </motion.div>

            <div className="relative mx-auto h-[600px] w-full" style={{ maxWidth: SLIDE_W }}>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-24 -z-10 rounded-full bg-[radial-gradient(circle,rgba(184,68,46,0.2),transparent_65%)] blur-2xl"
                animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto h-24 w-3/4 rounded-[50%] bg-primary-500/20 blur-3xl" />

              <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.button
                key={active.id}
                type="button"
                custom={direction}
                onClick={() => use(active.id)}
                aria-label={`Use the ${active.name} template`}
                className="group absolute inset-x-0 mx-auto cursor-pointer focus-ring"
                style={{ width: SLIDE_W }}
                initial={{ opacity: 0, x: direction > 0 ? 150 : -150, scale: 0.93 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction > 0 ? -150 : 150, scale: 0.93 }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative aspect-[1/1.4142] w-full overflow-hidden rounded-xl bg-white shadow-[0_50px_110px_-30px_rgba(0,0,0,0.9)] ring-1 ring-primary-500/25 transition-[box-shadow,transform] duration-500 group-hover:-translate-y-1.5 group-hover:ring-primary-500/50">
                  <TemplateThumbnail templateId={active.id} eager />

                  <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-dark-950/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="mb-7 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-primary-500">
                      Use this template <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                </motion.button>
              </AnimatePresence>
            </div>

            <motion.dl
              key={`m-${active.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="hidden space-y-6 pl-4 lg:block"
            >
              {[
                { k: 'Style', v: active.category },
                { k: 'Structure', v: active.columns === 2 ? 'Two column' : 'Single column' },
                { k: 'Parsing', v: 'ATS friendly' },
                { k: 'Price', v: 'Free' },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="text-[9.5px] font-semibold uppercase tracking-[0.3em] text-dark-400">
                    {row.k}
                  </dt>
                  <dd className="mt-1.5 text-sm capitalize text-dark-200">{row.v}</dd>
                </div>
              ))}
              <span className="block h-px w-16 bg-primary-500/40" />
            </motion.dl>
          </div>

          <button
            type="button"
            onClick={() => go(index - 1, -1)}
            aria-label="Previous template"
            className="focus-ring absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dark-700 bg-surface-elevated/80 text-dark-200 backdrop-blur transition-colors hover:border-primary-500/60 hover:text-primary-400 md:left-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1, 1)}
            aria-label="Next template"
            className="focus-ring absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-dark-700 bg-surface-elevated/80 text-dark-200 backdrop-blur transition-colors hover:border-primary-500/60 hover:text-primary-400 md:right-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto mt-12 min-h-[104px] max-w-2xl px-6 text-center">
          <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h3 className="font-display text-2xl font-bold text-dark-100">{active.name}</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-dark-400">
              {active.description}
            </p>
          </motion.div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5">
          {slides.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Go to ${t.name}`}
              className="focus-ring group py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === index ? 'w-10 bg-primary-500' : 'w-4 bg-dark-700 group-hover:bg-dark-600'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 px-6">
          <Link href="/templates" className="focus-ring group relative inline-flex">
            <span className="absolute -inset-1 rounded-xl bg-primary-500/25 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative inline-flex items-center gap-3 rounded-xl border border-primary-400/40 bg-primary-600 px-9 py-4 text-base font-semibold text-white shadow-lg shadow-primary-900/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary-500">
              Explore the full collection
              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          <p className="text-xs tracking-wide text-dark-400">
            {Object.keys(LAYOUT_LABELS).length} layouts — all free, all ATS-friendly
          </p>
        </div>
      </div>
    </section>
  )
}
