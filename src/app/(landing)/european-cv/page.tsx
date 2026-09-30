import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  Languages,
  ShieldCheck,
} from 'lucide-react'
import { TemplateThumbnail } from '@/components/editor/TemplateThumbnail'
import { Button } from '@/components/ui'
import { pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Free Europass CV Builder for Students — Netsa CV',
  description:
    'Create a free Europass CV with EQF education levels, CEFR language grading, volunteering, honours, and the personal details European applications request.',
  path: '/europass',
})

const features = [
  {
    icon: Languages,
    title: 'Full CEFR language grid',
    body: 'Grade listening, reading, writing, spoken interaction, and spoken production separately from A1 to C2.',
  },
  {
    icon: GraduationCap,
    title: 'European education details',
    body: 'Record EQF levels and present education and training in the format scholarship reviewers expect.',
  },
  {
    icon: HeartHandshake,
    title: 'Volunteering and leadership',
    body: 'Give community work, organisational skills, and leadership experience their own proper sections.',
  },
  {
    icon: Award,
    title: 'Honours and awards',
    body: 'Show academic recognition, awards, and certifications without burying them inside general skills.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Application-ready structure',
    body: 'Use a clear multi-page document for European jobs, university applications, scholarships, and visas.',
  },
  {
    icon: ShieldCheck,
    title: 'Private and account-free',
    body: 'Build without an EU Login account. Your CV data stays in your browser and the exported PDF has no watermark.',
  },
]

export default function EuropeanCvPage() {
  return (
    <div className="overflow-hidden pt-20">
      <section className="relative border-b border-white/5 px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(124,58,237,0.2),transparent_38%),radial-gradient(circle_at_85%_35%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex rounded-2xl border border-white/10 bg-white px-5 py-3 shadow-xl shadow-black/20">
              <Image src="/brand/europass.png" alt="Europass" width={682} height={208} className="h-12 w-auto object-contain sm:h-14" priority />
            </div>
            <h1 className="font-display mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Free Europass CV preparation for students
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dark-300">
              Create a detailed Europass CV for scholarships, university applications, visas, and jobs—without creating an account or forcing your experience into a generic resume template.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/resume/new/edit?template=europe-slate">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                  Build my Europass CV
                  <ArrowRight size={18} className="ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="#included">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See what is included
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-dark-400">
              Free PDF export · No account · No watermark
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-primary-500/25 to-blue-500/5 blur-2xl" />
            <div className="relative aspect-[1/1.4142] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40 ring-1 ring-white/20">
              <TemplateThumbnail templateId="europe-slate" />
            </div>
          </div>
        </div>
      </section>

      <section id="included" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">A specialized editor</p>
            <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
              It asks for the details ordinary CV templates leave out
            </h2>
            <p className="mt-4 text-base leading-relaxed text-dark-300">
              Choosing Europass changes the editor itself. You only see these extra questions when this format can print them.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-dark-700 bg-surface-elevated p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
                  <feature.icon size={21} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-400">{feature.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-primary-500/25 bg-gradient-to-r from-primary-500/10 to-blue-500/5 px-6 py-10 text-center sm:px-10">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Ready for your application?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-dark-300">
              Open the dedicated editor, complete the European-specific fields, and export a clean multi-page PDF.
            </p>
            <Link href="/resume/new/edit?template=europe-slate" className="mt-7 inline-block">
              <Button variant="gradient" size="lg">
                Start Europass CV
                <ArrowRight size={18} className="ml-2" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-center text-xs leading-relaxed text-dark-500">
            The Europass name and logo remain the property of Europass and are used by Netsacv.com with permission for free student CV preparation and scholarship assistance.
          </p>
        </div>
      </section>
    </div>
  )
}
