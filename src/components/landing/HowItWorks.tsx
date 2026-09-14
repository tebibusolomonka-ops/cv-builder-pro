'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LAYOUT_LABELS } from '@/lib/constants'

const STEPS = [
  {
    art: '/illustrations/01.svg',
    title: 'Pick a layout',
    body: `${Object.keys(LAYOUT_LABELS).length} designed layouts, each shown as a live preview rather than a mockup. Nothing is locked.`,
  },
  {
    art: '/illustrations/02.svg',
    title: 'Fill in your details',
    body: 'Guided sections for experience, education and skills. Your page updates as you type, and everything saves to this device.',
  },
  {
    art: '/illustrations/03.svg',
    title: 'Download the PDF',
    body: 'A print-perfect A4 file with selectable text, so applicant tracking systems can actually read it.',
  },
]

export function HowItWorks() {
  return (
    <section className="landing-section landing-stats-section border-y border-dark-800 overflow-hidden">
      <div className="landing-section-inner">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.28em] text-primary-400">
            How it works
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-dark-100 md:text-4xl">
            Three steps, <span className="text-dark-400">no account needed</span>
          </h2>
        </div>

        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-dark-800 bg-surface-elevated/60 p-7 transition-colors duration-500 hover:border-primary-500/40"
            >
              <span className="pointer-events-none absolute -top-10 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl transition-opacity duration-500 group-hover:bg-primary-500/20" />

              <div className="relative mb-6 h-40">
                <Image
                  src={step.art}
                  alt=""
                  aria-hidden
                  fill
                  className="object-contain transition-transform duration-500 group-hover:-translate-y-1.5"
                />
              </div>

              <div className="relative flex items-baseline gap-3">
                <span className="text-xs font-bold tabular-nums text-primary-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold text-dark-100">{step.title}</h3>
              </div>
              <p className="relative mt-2 text-sm leading-relaxed text-dark-400">{step.body}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link
            href="/templates"
            className="focus-ring text-sm font-medium text-primary-400 transition-colors hover:text-primary-300"
          >
            Browse the layouts →
          </Link>
        </div>
      </div>
    </section>
  )
}
