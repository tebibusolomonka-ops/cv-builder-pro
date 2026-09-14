'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, FileDown } from 'lucide-react'

const MOCKUPS = [
  '/mockups/full-stack.png',
  '/mockups/accountant.png',
  '/mockups/slate.png',
  '/mockups/journalist.png',
  '/mockups/cleanproffessional.png',
  '/mockups/resume3.jpg',
]

const FLOATERS = [
  { src: 0, left: '7%', top: '14%', rot: -9, w: 210, dur: 17, delay: 0 },
  { src: 2, left: '25%', top: '58%', rot: 6, w: 176, dur: 21, delay: 2.4 },
  { src: 4, left: '39%', top: '6%', rot: -4, w: 190, dur: 19, delay: 1.1 },
  { src: 1, left: '57%', top: '62%', rot: 8, w: 200, dur: 23, delay: 3.2 },
  { src: 5, left: '72%', top: '11%', rot: -7, w: 182, dur: 18, delay: 0.7 },
  { src: 3, left: '86%', top: '48%', rot: 5, w: 196, dur: 25, delay: 1.8 },
  { src: 0, left: '15%', top: '80%', rot: 7, w: 168, dur: 20, delay: 4.1 },
  { src: 4, left: '47%', top: '30%', rot: -6, w: 160, dur: 26, delay: 2.9 },
  { src: 2, left: '79%', top: '80%', rot: -8, w: 186, dur: 22, delay: 1.4 },
  { src: 1, left: '62%', top: '88%', rot: 4, w: 172, dur: 24, delay: 3.7 },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  // Update the mask directly to avoid re-rendering on every mousemove.
  const overlayRef = useRef<HTMLDivElement>(null)

  const setSpotlight = (x: number, y: number, radius: number) => {
    const el = overlayRef.current
    if (!el) return
    const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.6) 65%, black 100%)`
    el.style.maskImage = mask
    el.style.webkitMaskImage = mask
  }

  const handleSpotlightMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setSpotlight(e.clientX - rect.left, e.clientY - rect.top, 240)
  }

  const handleSpotlightLeave = () => {
    setSpotlight(-1000, -1000, 0)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSpotlightMove}
      onMouseLeave={handleSpotlightLeave}
      className="relative w-full min-h-screen bg-surface flex items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {FLOATERS.map((f, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: f.left, top: f.top }}
          >
            <div
              style={{
                animationName: 'float',
                animationDuration: `${f.dur}s`,
                animationDelay: `-${f.delay}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
              }}
            >
              <div
                className="relative overflow-hidden rounded-lg bg-white shadow-[0_28px_70px_-14px_rgba(0,0,0,0.95)] ring-1 ring-white/10"
                style={{
                  width: f.w,
                  height: Math.round(f.w * 1.4142),
                  transform: `rotate(${f.rot}deg)`,
                }}
              >
                <Image
                  src={MOCKUPS[f.src]}
                  alt=""
                  aria-hidden
                  fill
                  sizes="210px"
                  loading="eager"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 will-change-[mask-image]"
        style={{
          backgroundColor: 'rgba(23, 16, 14, 0.965)',
          backgroundImage: `linear-gradient(rgba(234, 220, 198, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 220, 198, 0.045) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          // A backdrop filter here causes a full-viewport repaint during animation.
          maskImage: 'radial-gradient(circle 0px at -1000px -1000px, transparent 0%, rgba(0,0,0,0.6) 65%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle 0px at -1000px -1000px, transparent 0%, rgba(0,0,0,0.6) 65%, black 100%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(ellipse_46%_34%_at_50%_50%,rgba(23,16,14,0.55),transparent_75%)]" />

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 w-full mt-20">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-display mb-6 text-balance text-5xl font-bold leading-[1.08] tracking-tight text-dark-100 sm:text-6xl md:text-7xl lg:text-[80px]"
            style={{ textShadow: '0 6px 34px rgba(0,0,0,0.65)' }}
          >
            Make your experience <br className="hidden sm:block" />
            <span className="text-dark-400">impossible to overlook</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-dark-300 sm:text-lg md:text-xl lg:text-2xl"
          >
            Twenty-six designed layouts, live previews, and a clean PDF at the end. Everything stays
            on your device, and none of it costs anything.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard" className="inline-block">
              <span className="group inline-flex items-center gap-3 rounded-xl bg-primary-600 px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-primary-900/40 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-500 hover:shadow-primary-800/50 sm:text-xl">
                <FileDown className="h-6 w-6 transition-transform group-hover:translate-y-0.5" />
                Build Your Resume Free
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        aria-label="Scroll to next section"
        className="group absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-dark-400">Scroll</span>
        <ArrowDown className="h-5 w-5 text-primary-500/70 transition-colors group-hover:text-primary-400 animate-bounce-gentle" />
      </motion.button>
    </section>
  )
}
