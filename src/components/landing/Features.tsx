'use client'

import { motion } from 'framer-motion'
import { HardDrive, FileCheck2, Unlock, Eye } from 'lucide-react'
import { TEMPLATES } from '@/lib/constants'

const BENEFITS = [
  {
    icon: HardDrive,
    title: 'Nothing leaves your device',
    body: 'Your CV is saved in this browser, not on our computers. You do not need an account, and there is nothing to delete later.',
  },
  {
    icon: FileCheck2,
    title: 'A real A4 PDF',
    body: 'Your file is the right size for printing, and the words inside are real text. Hiring software can read them instead of seeing only a picture.',
  },
  {
    icon: Unlock,
    title: 'Nothing is locked',
    body: `All ${TEMPLATES.length} designs are free to use, and your PDF has no logo or mark on it.`,
  },
  {
    icon: Eye,
    title: 'What you see is what prints',
    body: 'The CV on your screen is the same one inside your PDF. It will not look different when you send it.',
  },
]

export function Features() {
  return (
    <section className="landing-section landing-features-section overflow-hidden" id="why">
      <div className="landing-section-inner">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.28em] text-primary-400">
            Why build it here
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-dark-100 md:text-4xl">
            Free, private, <span className="text-dark-400">and easy to read</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group flex gap-5 rounded-2xl border border-dark-800 bg-surface-elevated/50 p-7 transition-colors duration-500 hover:border-primary-500/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary-500/25 bg-primary-500/10 text-primary-400 transition-colors duration-500 group-hover:bg-primary-600 group-hover:text-white">
                <b.icon size={19} />
              </span>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-dark-100">{b.title}</h3>
                <p className="text-sm leading-relaxed text-dark-400">{b.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
