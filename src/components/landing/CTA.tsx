'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { ArrowRight, FileCheck2 } from 'lucide-react'

export function CTA() {
  return (
    <section className="landing-section landing-cta-section overflow-hidden">
      <div className="absolute inset-0 bg-primary-600/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="landing-cta-inner relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl border border-primary-400/30 bg-surface-elevated shadow-lg shadow-black/20">
            <FileCheck2 className="h-8 w-8 text-primary-300" aria-hidden="true" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
            Make your CV today.
          </h2>
          <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">
            Choose a design, add your details, and download your PDF. You do not need an account,
            and your information stays in this browser.
          </p>

          <Link href="/dashboard">
            <Button variant="gradient" size="lg" className="text-lg px-8 group">
              Start Your CV
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-dark-400">
            No sign-up. No credit card. Free to use.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
