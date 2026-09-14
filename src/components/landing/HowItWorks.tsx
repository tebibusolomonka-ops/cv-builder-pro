'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LAYOUT_LABELS } from '@/lib/constants'

const STEPS = [
  {
    art: '/illustrations/01.svg',
    title: 'Choose a design',
    body: `${Object.keys(LAYOUT_LABELS).length} designs to choose from. You can see how each one really looks before you pick it, and they are all free.`,
  },
  {
    art: '/illustrations/02.svg',
    title: 'Fill in your details',
    body: 'Add your work, your school and your skills. Your CV changes as you type, and it saves on your device.',
  },
  {
    art: '/illustrations/03.svg',
    title: 'Download the PDF',
    body: 'You get an A4 file with real text inside it. People can read it, and so can the software companies use to sort CVs.',
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
