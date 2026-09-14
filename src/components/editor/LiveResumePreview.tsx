'use client'


import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Award, Briefcase, GraduationCap, Globe, Languages as LanguagesIcon, Mail, MapPin, Phone, User, Users, Wrench } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { TemplateDefinition, TemplateLayoutId, TEMPLATES } from '@/lib/constants'
import { useResumeStore } from '@/store/useResumeStore'
import { Certification, Education, Language, Project, Reference, Skill, WorkExperience } from '@/types/resume'
import { cn } from '@/utils/cn'

type PreviewModel = {
  template: TemplateDefinition
  name: string
  title: string
  location: string
  email: string
  phone: string
  website: string
  linkedin: string
  github: string
  photo: string
  summary: string
  experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  references: Reference[]
}

// Sample resume data

const sampleExperience: WorkExperience[] = [
  {
    id: 'sample-exp-1',
    title: 'Senior Frontend Developer',
    jobTitle: 'Senior Frontend Developer',
    company: 'Safaricom Ethiopia',
    location: 'Addis Ababa',
    startDate: '2021-03',
    endDate: 'Present',
    current: true,
    description:
      'Lead frontend architecture for a customer-facing telecom dashboard serving 3M+ subscribers across Ethiopia.\nMigrated a five-year-old codebase to React and TypeScript, cutting bundle size by 60% and first paint by 1.8s.\nMentor a team of five engineers, run weekly accessibility audits and own the performance budget.\nIntroduced a shared component library now used by four product teams, halving new-feature build time.\nPartner with design and product to ship a bilingual Amharic/English interface used daily by 40,000 agents.',
    achievements: [],
  },
  {
    id: 'sample-exp-2',
    title: 'Full-Stack Developer',
    jobTitle: 'Full-Stack Developer',
    company: 'iCog Labs',
    location: 'Addis Ababa',
    startDate: '2018-06',
    endDate: '2021-02',
    current: false,
    description:
      'Built real-time collaboration tools for research teams using React, WebSockets and a Python service layer.\nDeployed and maintained containerised applications on AWS with Docker, Kubernetes and GitHub Actions.\nIntroduced an automated test suite that cut production regressions by 40% within two quarters.\nRedesigned the annotation workflow, reducing dataset labelling from three days to seven hours.',
    achievements: [],
  },
  {
    id: 'sample-exp-3',
    title: 'Junior Web Developer',
    jobTitle: 'Junior Web Developer',
    company: 'MIDROC Technology Group',
    location: 'Addis Ababa',
    startDate: '2016-09',
    endDate: '2018-05',
    current: false,
    description:
      'Developed and maintained internal portals used daily by the HR, logistics and finance departments.\nAutomated weekly reporting pipelines, saving the operations team more than ten hours every week.\nRebuilt intranet search, cutting average lookup time from 40 seconds to under 5.\nDocumented the deployment process and trained two junior developers who now own the portal.',
    achievements: [],
  },
  {
    id: 'sample-exp-4',
    title: 'Web Development Intern',
    jobTitle: 'Web Development Intern',
    company: 'Ethio Telecom',
    location: 'Addis Ababa',
    startDate: '2015-07',
    endDate: '2016-08',
    current: false,
    description:
      'Supported the digital services team on customer self-service portals used by 200,000 subscribers.\nBuilt reusable form components later adopted across four internal products.\nWrote the onboarding guide still used to bring new interns up to speed.',
    achievements: [],
  },
]

const sampleProjects: Project[] = [
  {
    id: 'sample-proj-1',
    name: 'Telebirr Merchant Dashboard',
    description:
      'Real-time analytics dashboard for 12,000 merchants, built with Next.js and a streaming API layer.',
    technologies: ['Next.js', 'TypeScript', 'WebSockets'],
    url: '',
    startDate: '',
    endDate: '',
  },
  {
    id: 'sample-proj-2',
    name: 'Amharic Accessibility Toolkit',
    description:
      'Open-source component library adding screen-reader and right-to-left support for Amharic interfaces.',
    technologies: ['React', 'ARIA', 'i18n'],
    url: '',
    startDate: '',
    endDate: '',
  },
]

const sampleEducation: Education[] = [
  {
    id: 'sample-edu-1',
    degree: 'Master of Science',
    fieldOfStudy: 'Computer Science',
    school: 'Addis Ababa University',
    location: 'Addis Ababa',
    startDate: '',
    endDate: '2020',
    current: false,
    gpa: '',
    description: '',
  },
  {
    id: 'sample-edu-2',
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Software Engineering',
    school: 'Addis Ababa Institute of Technology',
    location: 'Addis Ababa',
    startDate: '',
    endDate: '2016',
    current: false,
    gpa: '',
    description: '',
  },
]

const sampleSkills: Skill[] = [
  { id: 'sample-skill-1', name: 'React / Next.js', level: 'expert' },
  { id: 'sample-skill-2', name: 'TypeScript', level: 'advanced' },
  { id: 'sample-skill-3', name: 'Node.js', level: 'advanced' },
  { id: 'sample-skill-4', name: 'Cloud Architecture', level: 'intermediate' },
  { id: 'sample-skill-5', name: 'UI / UX Design', level: 'intermediate' },
  { id: 'sample-skill-6', name: 'Team Leadership', level: 'advanced' },
  { id: 'sample-skill-7', name: 'Testing / CI', level: 'advanced' },
  { id: 'sample-skill-8', name: 'Accessibility', level: 'intermediate' },
]

const sampleLanguages: Language[] = [
  { id: 'sample-lang-1', name: 'Amharic', proficiency: 'native' },
  { id: 'sample-lang-2', name: 'English', proficiency: 'fluent' },
  { id: 'sample-lang-3', name: 'Afaan Oromoo', proficiency: 'conversational' },
]

const sampleCertifications: Certification[] = [
  { id: 'sample-cert-1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023', expiryDate: '', url: '' },
  { id: 'sample-cert-2', name: 'Professional Scrum Master I', issuer: 'Scrum.org', date: '2022', expiryDate: '', url: '' },
  { id: 'sample-cert-3', name: 'Google UX Design Certificate', issuer: 'Coursera', date: '2021', expiryDate: '', url: '' },
]

const sampleReferences: Reference[] = [
  { id: 'sample-ref-1', name: 'Meseret Alemu', title: 'Engineering Manager', company: 'Safaricom Ethiopia', email: '', phone: '', relationship: '' },
  { id: 'sample-ref-2', name: 'Daniel Kebede', title: 'Chief Technology Officer', company: 'iCog Labs', email: '', phone: '', relationship: '' },
]

const SAMPLE_PERSONA = {
  name: 'Samuel Tesfaye',
  title: 'Senior Frontend Developer',
  location: 'Addis Ababa, Ethiopia',
  email: 'samuel.tesfaye@example.com',
  phone: '+251 911 234 567',
  website: 'samueltesfaye.dev',
  linkedin: 'linkedin.com/in/samuel-tesfaye',
  github: '',
  summary:
    'Detail-oriented frontend engineer with 8+ years of experience building high-traffic web products. Proven ability to lead architecture decisions, mentor teams, and ship accessible, performant interfaces that users love.',
}

// Keep each sample name paired with its portrait.
const SAMPLE_PEOPLE = [
  { name: 'Selamawit Bekele', portrait: '01' },
  { name: 'Yonas Alemu', portrait: '02' },
  { name: 'Sumeya Ahmed', portrait: '03' },
  { name: 'Dawit Haile', portrait: '04' },
  { name: 'Rahel Tadesse', portrait: '05' },
  { name: 'Hayat Mohammed', portrait: '06' },
  { name: 'Abel Girma', portrait: '07' },
  { name: 'Hiwot Tesfaye', portrait: '08' },
  { name: 'Nahom Assefa', portrait: '09' },
  { name: 'Marta Kebede', portrait: '10' },
] as const

function personFor(templateId: string) {
  let hash = 0
  for (let i = 0; i < templateId.length; i++) hash = (hash * 31 + templateId.charCodeAt(i)) >>> 0
  const p = SAMPLE_PEOPLE[hash % SAMPLE_PEOPLE.length]
  const slug = p.name.toLowerCase().replace(/\s+/g, '-')
  const handle = p.name.toLowerCase().replace(/\s+/g, '.')
  return {
    name: p.name,
    // Version the URL when replacing a portrait file.
    photo: `/sample/portraits/${p.portrait}.jpg?v=4`,
    email: `${handle}@example.com`,
    website: `${slug}.dev`,
    linkedin: `linkedin.com/in/${slug}`,
  }
}

function usePreviewModel(templateIdOverride?: string, forceSample = false): PreviewModel {
  const { data } = useResumeStore()
  const info = data.personalInfo
  const template = TEMPLATES.find((item) => item.id === (templateIdOverride || data.style.templateId)) ?? TEMPLATES[0]

  if (forceSample) {
    return {
      template,
      ...SAMPLE_PERSONA,
      ...personFor(template.id),
      experience: sampleExperience,
      education: sampleEducation,
      skills: sampleSkills,
      projects: sampleProjects,
      certifications: sampleCertifications,
      languages: sampleLanguages,
      references: sampleReferences,
    }
  }

  const name = info.fullName || [info.firstName, info.lastName].filter(Boolean).join(' ') || SAMPLE_PERSONA.name
  const location = info.location || [info.city, info.state, info.country].filter(Boolean).join(', ')

  return {
    template,
    name,
    title: info.title || SAMPLE_PERSONA.title,
    location: location || SAMPLE_PERSONA.location,
    email: info.email || SAMPLE_PERSONA.email,
    phone: info.phone || SAMPLE_PERSONA.phone,
    website: info.website || info.portfolio || SAMPLE_PERSONA.website,
    linkedin: info.linkedin || SAMPLE_PERSONA.linkedin,
    github: info.github,
    photo: info.profilePhoto,
    summary: data.summary || SAMPLE_PERSONA.summary,
    experience: data.workExperience.length > 0 ? data.workExperience : sampleExperience,
    education: data.education.length > 0 ? data.education : sampleEducation,
    skills: data.skills.length > 0 ? data.skills : sampleSkills,
    projects: data.projects,
    certifications: data.certifications.length > 0 ? data.certifications : sampleCertifications,
    languages: data.languages.length > 0 ? data.languages : sampleLanguages,
    references: data.references.length > 0 ? data.references : sampleReferences,
  }
}

const RENDERERS: Record<TemplateLayoutId, (props: { model: PreviewModel }) => React.ReactNode> = {
  premier: PremierResume,
  modern: ModernResume,
  professional: ProfessionalResume,
  minimal: MinimalResume,
  academic: AcademicResume,
  creative: CreativeResume,
  ats: AtsResume,
  timeline: TimelineResume,
  banner: BannerResume,
  duo: DuoResume,
  monogram: MonogramResume,
  split: SplitResume,
  compact: CompactResume,
  elegant: ElegantResume,
  ledger: LedgerResume,
  gazette: GazetteResume,
  aperture: ApertureResume,
  facet: FacetResume,
  halo: HaloResume,
  atrium: AtriumResume,
  vista: VistaResume,
  vertex: VertexResume,
  meridian: MeridianResume,
  crest: CrestResume,
  obsidian: ObsidianResume,
  solstice: SolsticeResume,
  capsule: CapsuleResume,
  marquee: MarqueeResume,
  bureau: BureauResume,
  terminal: TerminalResume,
  gauge: GaugeResume,
  tagged: TaggedResume,
  placard: PlacardResume,
  regent: RegentResume,
  signature: SignatureResume,
  corner: CornerResume,
  dossier: DossierResume,
  pillar: PillarResume,
  bulletin: BulletinResume,
  quill: QuillResume,
  rosette: RosetteResume,
  bloom: BloomResume,
  column: ColumnResume,
  alcove: AlcoveResume,
  tablet: TabletResume,
  gutter: GutterResume,
  billboard: BillboardResume,
  verdant: VerdantResume,
  envoy: EnvoyResume,
  ribbon: RibbonResume,
  lattice: LatticeResume,
}

export function LiveResumePreview({ templateId, forceSample = false }: { templateId?: string; forceSample?: boolean }) {
  const model = usePreviewModel(templateId, forceSample)
  const Renderer = RENDERERS[model.template.baseTemplate] ?? ModernResume
  return <Renderer model={model} />
}

// Shared layout helpers

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"

/**
 * Dark text for layouts whose palette family is 'panel'.
 *
 * For those, `secondary` is a PALE background tint (#e9f1fe and friends), not
 * an ink. Solstice painted its page text, all seven section headings and every
 * job title with it, so they rendered near-white on white — 1.1:1, invisible.
 * The page then read as blocks of text floating in empty space, because the
 * headings between them were gone. If a panel-family layout needs dark text,
 * it uses this.
 */
const INK = '#2c3440'

const MONO = "'JetBrains Mono', 'Consolas', 'SF Mono', ui-monospace, monospace"

/** skillWidth as a number, for anything that draws a value rather than a bar. */
function skillPercent(level: Skill['level']) {
  return level === 'beginner' ? 25 : level === 'intermediate' ? 50 : level === 'advanced' ? 75 : 100
}

// A4 at 96dpi. Apply zoom to Page because some templates require its direct children.
const PAGE_W = 794
const PAGE_H = 1123

const PAGE_ZOOM = 0.79
const MIN_ZOOM = 0.6
const MAX_ZOOM = 1.08
const TARGET_PAGE_FILL = 0.98
const FIT_EPSILON = 0.003
// Cap fitting passes to prevent a render loop.
const MAX_FIT_PASSES = 10

// useLayoutEffect is only safe after hydration.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function Page({ className, style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [zoom, setZoom] = useState(PAGE_ZOOM)
  const [fontRevision, setFontRevision] = useState(0)
  const [fitReady, setFitReady] = useState(false)
  const passes = useRef(0)
  const fittedContent = useRef('')
  const overflowCeiling = useRef(MAX_ZOOM)

  // Refit after web fonts replace the fallback metrics.
  useEffect(() => {
    let cancelled = false
    void document.fonts.ready.then(() => {
      if (!cancelled) {
        fittedContent.current = ''
        setFitReady(false)
        setFontRevision((revision) => revision + 1)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Check the painted page because flex and grid minimums can settle late.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const el = ref.current
      if (!el || !el.clientHeight) return

      const pageRect = el.getBoundingClientRect()
      let contentBottom = pageRect.top
      for (const item of el.querySelectorAll('*')) {
        const hasText = item.children.length === 0 && Boolean(item.textContent?.trim())
        // Ignore portrait overscan inside clipped frames.
        if (!hasText) continue

        const rect = item.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) contentBottom = Math.max(contentBottom, rect.bottom)
      }

      const scrollOverflow = el.scrollHeight > el.clientHeight + 1
      const visualOverflow = contentBottom > pageRect.bottom + 1
      if (!scrollOverflow && !visualOverflow) return

      const scrollSafeZoom = scrollOverflow
        ? zoom * ((el.clientHeight * TARGET_PAGE_FILL) / el.scrollHeight)
        : MAX_ZOOM
      const visualSafeZoom = visualOverflow
        ? zoom * ((pageRect.height * TARGET_PAGE_FILL) / (contentBottom - pageRect.top))
        : MAX_ZOOM
      const overflowSafeZoom = Math.max(MIN_ZOOM, Math.min(scrollSafeZoom, visualSafeZoom))
      if (overflowSafeZoom < zoom - FIT_EPSILON) {
        overflowCeiling.current = Math.min(overflowCeiling.current, overflowSafeZoom)
        setFitReady(false)
        setZoom(overflowSafeZoom)
      }
    })

    return () => cancelAnimationFrame(frame)
  })

  // Zoom changes line wrapping, so measure and refine each layout iteratively.
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    // Reset the pass count when visible resume content changes.
    const contentSignature = `${fontRevision}\n${className ?? ''}\n${JSON.stringify(style ?? {})}\n${el.innerHTML}`
    if (contentSignature !== fittedContent.current) {
      fittedContent.current = contentSignature
      passes.current = 0
      overflowCeiling.current = MAX_ZOOM
      setFitReady(false)
    }

    if (passes.current >= MAX_FIT_PASSES) {
      if (fontRevision > 0) setFitReady(true)
      return
    }

    // Include overflow from the final pinned flex or grid layout.
    const pinnedClient = el.clientHeight
    const pinnedScroll = el.scrollHeight

    // Release the pinned height while measuring natural content.
    const pinned = el.style.height
    el.style.height = 'auto'
    const natural = el.scrollHeight
    el.style.height = pinned
    if (!natural) return

    // Damp the correction because a larger zoom narrows the layout and adds wrapping.
    let target = (PAGE_H * TARGET_PAGE_FILL) / natural
    if (pinnedClient > 0 && pinnedScroll > pinnedClient + 1) {
      const overflowSafeTarget = zoom * ((pinnedClient * TARGET_PAGE_FILL) / pinnedScroll)
      target = Math.min(target, overflowSafeTarget)
    }
    const next = Math.min(
      MAX_ZOOM,
      overflowCeiling.current,
      Math.max(MIN_ZOOM, zoom + (target - zoom) * 0.6)
    )

    if (Math.abs(next - zoom) > FIT_EPSILON) {
      passes.current += 1
      setFitReady(false)
      setZoom(next)
    } else if (fontRevision > 0) {
      setFitReady(true)
    }
  })

  return (
    <article
      ref={ref}
      data-resume-fit-ready={fitReady ? 'true' : 'false'}
      className={cn('overflow-hidden bg-white font-sans text-[#30343b]', className)}
      style={{
        zoom,
        width: PAGE_W / zoom,
        height: PAGE_H / zoom,
        ...style,
      }}
    >
      {children}
    </article>
  )
}

function Avatar({ model, size = 112, ring, className }: { model: PreviewModel; size?: number; ring?: string; className?: string }) {
  return (
    <div
      className={cn('relative shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size, border: ring ? `4px solid ${ring}` : undefined }}
    >
      {model.photo ? (
        // Overscan removes edge artifacts from the source portraits.
        <Image src={model.photo} alt={model.name} fill unoptimized className="object-cover" style={{ transform: 'scale(1.22)', transformOrigin: '50% 22%' }} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black/10 font-bold" style={{ fontSize: size * 0.32 }}>
          {initials(model.name)}
        </div>
      )}
    </div>
  )
}

function contactItems(model: PreviewModel) {
  return [
    { icon: Phone, text: model.phone },
    { icon: Mail, text: model.email },
    { icon: MapPin, text: model.location },
    { icon: Globe, text: cleanUrl(model.website) },
    { icon: FaLinkedin, text: cleanUrl(model.linkedin) },
    { icon: FaGithub, text: cleanUrl(model.github) },
  ].filter((item) => Boolean(item.text))
}

function ContactChips({ model, chipBg, chipColor, textClass }: { model: PreviewModel; chipBg: string; chipColor: string; textClass: string }) {
  return (
    <div className={cn('space-y-2.5 text-[10px]', textClass)}>
      {contactItems(model).map(({ icon: Icon, text }) => (
        <p key={text} className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: chipBg, color: chipColor }}>
            <Icon size={10} />
          </span>
          <span className="break-all leading-tight">{text}</span>
        </p>
      ))}
    </div>
  )
}

function ContactStrip({ model, className }: { model: PreviewModel; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-gray-600', className)}>
      {contactItems(model).map(({ text }) => (
        <span key={text}>{text}</span>
      ))}
    </div>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="whitespace-pre-wrap text-[11px] leading-5 text-gray-600">{children}</p>
}

function langStars(proficiency: Language['proficiency']) {
  if (proficiency === 'basic') return 1
  if (proficiency === 'conversational') return 2
  if (proficiency === 'proficient') return 3
  if (proficiency === 'fluent') return 4
  return 5
}

function Stars({ filled, color, dim = '#d1d5db' }: { filled: number; color: string; dim?: string }) {
  return (
    <span className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="inline-block h-1.5 w-1.5 rotate-45" style={{ backgroundColor: i < filled ? color : dim }} />
      ))}
    </span>
  )
}

function LanguageStars({ items, accent, dark = false }: { items: Language[]; accent: string; dark?: boolean }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className={cn('flex items-center justify-between gap-3 text-[10.5px]', dark ? 'text-white/85' : 'text-gray-700')}>
          <span>{item.name}</span>
          <Stars filled={langStars(item.proficiency)} color={accent} dim={dark ? 'rgba(255,255,255,0.25)' : undefined} />
        </div>
      ))}
    </div>
  )
}

function SkillBars({ skills, accent, track = 'rgba(255,255,255,0.18)', labelClass = 'text-white/90' }: { skills: Skill[]; accent: string; track?: string; labelClass?: string }) {
  return (
    <div className="space-y-2.5">
      {skills.map((skill) => (
        <div key={skill.id}>
          <p className={cn('mb-1 text-[10.5px] font-semibold', labelClass)}>{skill.name}</p>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: track }}>
            <div className="h-1.5 rounded-full" style={{ width: skillWidth(skill.level), backgroundColor: accent }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkillChips({ skills, accent, filled = false }: { skills: Skill[]; accent: string; filled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill.id}
          className="rounded-full px-2.5 py-1 text-[9.5px] font-semibold leading-none"
          style={filled ? { backgroundColor: accent, color: '#ffffff' } : { border: `1px solid ${accent}`, color: accent }}
        >
          {skill.name}
        </span>
      ))}
    </div>
  )
}

function SkillList({ skills, accent }: { skills: Skill[]; accent?: string }) {
  return (
    <div className="space-y-1.5 text-[11px] text-gray-700">
      {skills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-2">
          <span className="h-1 w-1 rotate-45 shrink-0" style={{ backgroundColor: accent ?? '#9ca3af' }} />
          <span>{skill.name}</span>
        </div>
      ))}
    </div>
  )
}

function EducationList({ items }: { items: Education[] }) {
  return (
    <div className="space-y-4">
      {items.map((edu) => (
        <div key={edu.id}>
          <h4 className="text-[11px] font-bold leading-snug">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree / Field of Study'}</h4>
          <p className="mt-0.5 text-[10.5px] text-gray-700">{edu.school || 'University Name'}</p>
          <p className="text-[10px] text-gray-500">{[edu.location, edu.endDate || edu.startDate].filter(Boolean).join(' · ')}</p>
          {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
        </div>
      ))}
    </div>
  )
}

function expDates(exp: WorkExperience) {
  return [exp.startDate, exp.endDate || (exp.current ? 'Present' : '')].filter(Boolean).join(' — ')
}

function ExperienceList({ items, accent, datePill = false }: { items: WorkExperience[]; accent: string; datePill?: boolean }) {
  return (
    <div className="space-y-5">
      {items.map((exp) => (
        <div key={exp.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[12.5px] font-bold" style={{ color: accent }}>{exp.title || exp.jobTitle || 'Job Title'}</h3>
              <p className="text-[11px] italic text-gray-500">{exp.company || 'Company'}{exp.location ? ` · ${exp.location}` : ''}</p>
            </div>
            {datePill ? (
              <span className="shrink-0 rounded border px-2 py-0.5 text-[9px] font-semibold text-gray-600" style={{ borderColor: accent }}>{expDates(exp)}</span>
            ) : (
              <p className="shrink-0 text-[10px] text-gray-500">{expDates(exp)}</p>
            )}
          </div>
          <BulletLines text={exp.description} accent={accent} />
        </div>
      ))}
    </div>
  )
}

function BulletLines({ text, accent }: { text: string; accent: string }) {
  return (
    <ul className="mt-1.5 space-y-1 text-[11px] leading-5 text-gray-600">
      {splitLines(text || 'Describe your impact, responsibilities, and achievements.').map((line) => (
        <li key={line} className="flex gap-2">
          <span style={{ color: accent }}>▪</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

function CertList({ items }: { items: Certification[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <p key={item.id} className="text-[10.5px] leading-snug text-gray-700">
          <strong>{item.name}</strong>
          {item.issuer ? ` — ${item.issuer}` : ''}
          {item.date ? `, ${item.date}` : ''}
        </p>
      ))}
    </div>
  )
}

function RefList({ items }: { items: Reference[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.id} className="text-[10.5px] leading-snug text-gray-700">
          <p className="font-bold">{item.name}</p>
          <p className="text-gray-500">{[item.title, item.company].filter(Boolean).join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

function ProjectList({ items, accent }: { items: Project[]; accent: string }) {
  if (items.length === 0) return null
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id}>
          <h3 className="text-[11.5px] font-bold" style={{ color: accent }}>{item.name}</h3>
          <Paragraph>{item.description}</Paragraph>
        </div>
      ))}
    </div>
  )
}

// Premier

function PremierResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-14 py-12" style={{ color: secondary }}>
      <header className="text-center">
        <h1 className="text-[42px] font-semibold leading-tight tracking-[0.02em]" style={{ fontFamily: SERIF, color: secondary }}>{model.name}</h1>
        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-24" style={{ backgroundColor: accent }} />
          <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: accent }} />
          <span className="h-px w-24" style={{ backgroundColor: accent }} />
        </div>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.35em]" style={{ color: accent }}>{model.title}</p>
        <ContactStrip model={model} className="mt-4 justify-center" />
      </header>
      <div className="mt-9 h-px w-full" style={{ backgroundColor: `${accent}55` }} />
      <div className="mt-8 grid grid-cols-[1fr_225px] gap-10">
        <main>
          <PremierSection title="Profile" accent={accent} secondary={secondary}><Paragraph>{model.summary}</Paragraph></PremierSection>
          <PremierSection title="Experience" accent={accent} secondary={secondary}>
            <div className="space-y-5">
              {model.experience.map((exp) => (
                <div key={exp.id} className="relative pl-5">
                  <span className="absolute left-0 top-[5px] h-1.5 w-1.5 rotate-45" style={{ backgroundColor: accent }} />
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[12.5px] font-bold" style={{ color: secondary }}>{exp.title || exp.jobTitle || 'Job Title'}</h3>
                    <p className="shrink-0 text-[10px] font-semibold tracking-wide" style={{ color: accent }}>{expDates(exp)}</p>
                  </div>
                  <p className="text-[11px] italic text-gray-500" style={{ fontFamily: SERIF }}>{exp.company || 'Company'}{exp.location ? `, ${exp.location}` : ''}</p>
                  <BulletLines text={exp.description} accent={accent} />
                </div>
              ))}
            </div>
          </PremierSection>
          {model.projects.length > 0 && <PremierSection title="Projects" accent={accent} secondary={secondary}><ProjectList items={model.projects} accent={secondary} /></PremierSection>}
          {model.references.length > 0 && <PremierSection title="References" accent={accent} secondary={secondary}><RefList items={model.references} /></PremierSection>}
        </main>
        {/* Spread the sections over the full height — see SideColumn. The
            sections' own mb-7 is dropped so only the distributed gap applies. */}
        <aside className="flex flex-col gap-1 border-l pl-8" style={{ borderColor: `${accent}40` }}>
          <PremierSection title="Education" accent={accent} secondary={secondary}><EducationList items={model.education} /></PremierSection>
          <PremierSection title="Expertise" accent={accent} secondary={secondary}><SkillList skills={model.skills} accent={accent} /></PremierSection>
          {model.certifications.length > 0 && <PremierSection title="Certifications" accent={accent} secondary={secondary}><CertList items={model.certifications} /></PremierSection>}
          {model.languages.length > 0 && <PremierSection title="Languages" accent={accent} secondary={secondary}><LanguageStars items={model.languages} accent={accent} /></PremierSection>}
        </aside>
      </div>
    </Page>
  )
}

function PremierSection({ title, accent, secondary, children }: { title: string; accent: string; secondary: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.28em]" style={{ fontFamily: SERIF, color: secondary }}>
        {title}
        <span className="mt-1.5 block h-px w-9" style={{ backgroundColor: accent }} />
      </h2>
      {children}
    </section>
  )
}

// Modern

function ModernResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex">
      <aside className="w-[275px] shrink-0 p-8 text-white" style={{ backgroundColor: secondary }}>
        <div className="mb-7 flex justify-center"><Avatar model={model} size={128} ring={accent} /></div>
        <SideSection title="Contact" accent={accent} dark><ContactChips model={model} chipBg={accent} chipColor="#ffffff" textClass="text-white/85" /></SideSection>
        <SideSection title="Education" accent={accent} dark>
          <div className="space-y-3">
            {model.education.map((e) => (
              <div key={e.id} className="text-[10.5px] leading-relaxed">
                <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-white/70">{e.school || 'University Name'}</p>
                <p className="text-white/50">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </SideSection>
        <SideSection title="Skills" accent={accent} dark><SkillBars skills={model.skills} accent={accent} /></SideSection>
        {model.languages.length > 0 && <SideSection title="Languages" accent={accent} dark><LanguageStars items={model.languages} accent={accent} dark /></SideSection>}
        {model.certifications.length > 0 && (
          <SideSection title="Certifications" accent={accent} dark>
            <div className="space-y-2.5 text-[11px] leading-relaxed text-white/80">
              {model.certifications.map((c) => <p key={c.id}><strong className="text-white/95">{c.name}</strong>{c.date ? ` · ${c.date}` : ''}</p>)}
            </div>
          </SideSection>
        )}
      </aside>
      <main className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="max-w-[420px] text-[40px] font-black uppercase leading-none tracking-wide" style={{ color: secondary }}>{model.name}</h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>{model.title}</p>
        </header>
        <MainSection title="Profile" accent={accent}><Paragraph>{model.summary}</Paragraph></MainSection>
        <MainSection title="Experience" accent={accent}><ExperienceList items={model.experience} accent={secondary} datePill /></MainSection>
        {model.projects.length > 0 && <MainSection title="Projects" accent={accent}><ProjectList items={model.projects} accent={secondary} /></MainSection>}
        {model.references.length > 0 && <MainSection title="References" accent={accent}><div className="grid grid-cols-2 gap-4"><RefList items={[model.references[0]]} />{model.references[1] && <RefList items={[model.references[1]]} />}</div></MainSection>}
      </main>
    </Page>
  )
}

// Professional

function ProfessionalResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page>
      <header className="relative flex items-start gap-6 px-10 pb-6 pt-9 text-white" style={{ backgroundColor: accent }}>
        <div className="w-[190px] shrink-0" />
        <div className="flex-1">
          <h1 className="text-[36px] font-semibold leading-tight" style={{ fontFamily: SERIF }}>{model.name}</h1>
        </div>
        <div className="w-[230px] shrink-0 rounded-md border border-white/40 p-3">
          <span className="mb-2 inline-block rounded-sm bg-white px-2 py-1 text-[8.5px] font-black uppercase tracking-widest" style={{ color: accent }}>{model.title}</span>
          <p className="text-[9px] leading-4 text-white/90">{truncate(model.summary, 200)}</p>
        </div>
      </header>
      <div className="flex">
        <aside className="w-[240px] shrink-0 px-7 pb-8" style={{ backgroundColor: secondary }}>
          <div className="-mt-16 mb-3 flex justify-center"><Avatar model={model} size={128} ring="#ffffff" /></div>
          <div className="mb-6 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: accent }}>{model.title}</p>
          </div>
          <IconSection title="Contact" icon={User} accent={accent}><ContactChips model={model} chipBg={accent} chipColor="#ffffff" textClass="text-gray-700" /></IconSection>
          <IconSection title="Education" icon={GraduationCap} accent={accent}><EducationList items={model.education} /></IconSection>
          <IconSection title="Skills" icon={Wrench} accent={accent}><SkillList skills={model.skills} accent={accent} /></IconSection>
          {model.languages.length > 0 && <IconSection title="Languages" icon={LanguagesIcon} accent={accent}><LanguageStars items={model.languages} accent={accent} /></IconSection>}
        </aside>
        <main className="flex-1 px-9 py-8">
          <IconSection title="Experience" icon={Briefcase} accent={accent}><ExperienceList items={model.experience} accent="#1f2937" datePill /></IconSection>
          <div className="mt-2 grid grid-cols-2 gap-5">
            {model.certifications.length > 0 && (
              <div className="rounded-md p-5" style={{ backgroundColor: secondary }}>
                <IconHeading title="Certifications" icon={Award} accent={accent} />
                <CertList items={model.certifications} />
              </div>
            )}
            {model.references.length > 0 && (
              <div className="rounded-md p-5" style={{ backgroundColor: secondary }}>
                <IconHeading title="References" icon={Users} accent={accent} />
                <RefList items={model.references} />
              </div>
            )}
          </div>
          {model.projects.length > 0 && <div className="mt-5"><IconSection title="Projects" icon={Wrench} accent={accent}><ProjectList items={model.projects} accent="#1f2937" /></IconSection></div>}
        </main>
      </div>
    </Page>
  )
}

function IconHeading({ title, icon: Icon, accent }: { title: string; icon: React.ComponentType<{ size?: number | string }>; accent: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[12px] font-black uppercase tracking-widest" style={{ color: accent }}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ backgroundColor: accent }}><Icon size={10} /></span>
      {title}
    </h2>
  )
}

function IconSection({ title, icon, accent, children }: { title: string; icon: React.ComponentType<{ size?: number | string }>; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <IconHeading title={title} icon={icon} accent={accent} />
      {children}
    </section>
  )
}

// Minimal

function MinimalResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex flex-col p-12">
      <header className="mb-9 border-b pb-7" style={{ borderColor: accent }}>
        <h1 className="max-w-[520px] text-[52px] font-black leading-none" style={{ fontFamily: SERIF, color: accent }}>{model.name}</h1>
        <p className="mt-3 text-sm text-gray-600">{model.title}</p>
        <ContactStrip model={model} className="mt-4" />
      </header>
      <div className="grid flex-1 grid-cols-[1fr_235px] gap-10">
        <main className="flex flex-col [&>section:last-child]:mb-0">
          <SimpleSection title="Profile" accent={accent}><Paragraph>{model.summary}</Paragraph></SimpleSection>
          <SimpleSection title="Experience" accent={accent}><ExperienceList items={model.experience} accent={accent} /></SimpleSection>
          {model.projects.length > 0 && <SimpleSection title="Projects" accent={accent}><ProjectList items={model.projects} accent={accent} /></SimpleSection>}
        </main>
        <aside className="flex flex-col [&>section:last-child]:mb-0">
          <SimpleSection title="Education" accent={accent}><EducationList items={model.education} /></SimpleSection>
          <SimpleSection title="Expertise" accent={accent}><SkillList skills={model.skills} accent={accent} /></SimpleSection>
          {model.languages.length > 0 && <SimpleSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></SimpleSection>}
          {model.certifications.length > 0 && <SimpleSection title="Certifications" accent={accent}><CertList items={model.certifications} /></SimpleSection>}
        </aside>
      </div>
    </Page>
  )
}

// Academic

function AcademicResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="grid grid-cols-[270px_1fr]">
      <aside className="px-8 py-10" style={{ backgroundColor: secondary }}>
        <div className="mb-7 rounded-lg p-5 text-white" style={{ backgroundColor: accent }}>
          <div className="mb-4 flex justify-center"><Avatar model={model} size={92} ring="rgba(255,255,255,0.6)" /></div>
          <ContactChips model={model} chipBg="rgba(255,255,255,0.2)" chipColor="#ffffff" textClass="text-white/90" />
        </div>
        <SideSection title="Education" accent={accent}><EducationList items={model.education} /></SideSection>
        <SideSection title="Expertise" accent={accent}><SkillList skills={model.skills} accent={accent} /></SideSection>
        {model.languages.length > 0 && <SideSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></SideSection>}
        {model.certifications.length > 0 && <SideSection title="Certifications" accent={accent}><CertList items={model.certifications} /></SideSection>}
      </aside>
      <main className="px-11 py-12">
        <header className="mb-9">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: accent }}>Curriculum Vitae</p>
          <h1 className="max-w-[420px] text-5xl font-black leading-none" style={{ color: accent }}>{model.name}</h1>
          <p className="mt-4 text-sm text-gray-600">{model.title}</p>
        </header>
        <MainSection title="Profile" accent={accent}><Paragraph>{model.summary}</Paragraph></MainSection>
        <MainSection title="Experience" accent={accent}><ExperienceList items={model.experience} accent={accent} /></MainSection>
        {model.projects.length > 0 && <MainSection title="Research & Projects" accent={accent}><ProjectList items={model.projects} accent={accent} /></MainSection>}
        {model.references.length > 0 && <MainSection title="References" accent={accent}><div className="grid grid-cols-2 gap-4"><RefList items={[model.references[0]]} />{model.references[1] && <RefList items={[model.references[1]]} />}</div></MainSection>}
      </main>
    </Page>
  )
}

// Creative

function CreativeResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page>
      <header className="flex h-[170px] items-center gap-7 px-12 text-white" style={{ backgroundColor: accent }}>
        <Avatar model={model} size={110} ring="rgba(255,255,255,0.7)" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/80">{model.title}</p>
          <h1 className="mt-2 max-w-[480px] text-[44px] font-black leading-none">{model.name}</h1>
        </div>
      </header>
      <div className="grid grid-cols-[235px_1fr] gap-8 px-10 py-9">
        <aside>
          <div className="mb-6 rounded-md p-5" style={{ backgroundColor: secondary }}>
            <ContactChips model={model} chipBg={accent} chipColor="#ffffff" textClass="text-gray-700" />
          </div>
          <SideSection title="Skills" accent={accent}><SkillChips skills={model.skills} accent={accent} /></SideSection>
          <SideSection title="Education" accent={accent}><EducationList items={model.education} /></SideSection>
          {model.languages.length > 0 && <SideSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></SideSection>}
        </aside>
        <main>
          <MainSection title="Profile" accent={accent}><Paragraph>{model.summary}</Paragraph></MainSection>
          <MainSection title="Experience" accent={accent}><ExperienceList items={model.experience} accent={accent} /></MainSection>
          {model.projects.length > 0 && <MainSection title="Projects" accent={accent}><ProjectList items={model.projects} accent={accent} /></MainSection>}
          {model.certifications.length > 0 && <MainSection title="Certifications" accent={accent}><CertList items={model.certifications} /></MainSection>}
        </main>
      </div>
    </Page>
  )
}

// ATS Classic

function AtsResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="p-12">
      <header className="border-b-2 pb-5" style={{ borderColor: accent }}>
        <h1 className="text-4xl font-bold uppercase tracking-wide" style={{ color: accent }}>{model.name}</h1>
        <p className="mt-1 text-sm font-semibold text-gray-700">{model.title}</p>
        <ContactStrip model={model} className="mt-4" />
      </header>
      <AtsSection title="Professional Summary"><Paragraph>{model.summary}</Paragraph></AtsSection>
      <AtsSection title="Work Experience"><ExperienceList items={model.experience} accent={accent} /></AtsSection>
      <div className="grid grid-cols-2 gap-10">
        <AtsSection title="Education"><EducationList items={model.education} /></AtsSection>
        <AtsSection title="Skills"><SkillList skills={model.skills} accent={accent} /></AtsSection>
      </div>
      <div className="grid grid-cols-2 gap-10">
        {model.certifications.length > 0 && <AtsSection title="Certifications"><CertList items={model.certifications} /></AtsSection>}
        {model.languages.length > 0 && (
          <AtsSection title="Languages">
            <p className="text-[11px] text-gray-700">{model.languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}</p>
          </AtsSection>
        )}
      </div>
    </Page>
  )
}

// Timeline

function TimelineResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-12 py-14" style={{ color: secondary }}>
      <header className="mb-10 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[46px] font-black leading-none" style={{ color: secondary }}>{model.name}</h1>
          <div className="mt-3 h-[5px] w-24" style={{ backgroundColor: accent }} />
          <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.28em]" style={{ color: accent }}>{model.title}</p>
        </div>
        <div className="max-w-[250px] text-right"><ContactStrip model={model} className="justify-end" /></div>
      </header>
      <Paragraph>{model.summary}</Paragraph>
      <div className="mt-10 grid grid-cols-[1fr_225px] gap-10">
        <main>
          <h2 className="mb-6 text-[15px] font-black uppercase tracking-[0.22em]" style={{ color: secondary }}>Career Timeline</h2>
          <div className="relative border-l-2 pl-7" style={{ borderColor: `${accent}66` }}>
            <div className="space-y-9">
              {model.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <span className="absolute -left-[37px] top-1 h-4 w-4 rounded-full border-[3px] bg-white" style={{ borderColor: accent }} />
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: accent }}>{expDates(exp)}</p>
                  <h3 className="mt-0.5 text-[13px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</h3>
                  <p className="text-[11px] italic text-gray-500">{exp.company || 'Company'}{exp.location ? ` · ${exp.location}` : ''}</p>
                  <BulletLines text={exp.description} accent={accent} />
                </div>
              ))}
            </div>
          </div>
        </main>
        <aside className="flex flex-col gap-7 [&>section]:mb-0">
          <SimpleSection title="Education" accent={accent}><EducationList items={model.education} /></SimpleSection>
          <SimpleSection title="Skills" accent={accent}><SkillChips skills={model.skills} accent={accent} filled /></SimpleSection>
          {model.languages.length > 0 && <SimpleSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></SimpleSection>}
          {model.certifications.length > 0 && <SimpleSection title="Certifications" accent={accent}><CertList items={model.certifications} /></SimpleSection>}
        </aside>
      </div>
    </Page>
  )
}

// Banner

function BannerResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page>
      <header className="flex items-center gap-7 px-11 py-9 text-white" style={{ backgroundColor: secondary }}>
        <Avatar model={model} size={104} ring={accent} />
        <div className="flex-1">
          <h1 className="text-[36px] font-black leading-none">{model.name}</h1>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>{model.title}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[9.5px] text-white/75">
            {contactItems(model).map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5"><Icon size={10} />{text}</span>
            ))}
          </div>
        </div>
      </header>
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
      <div className="grid grid-cols-2 gap-9 px-11 py-9">
        {/* Deliberately NOT distributed: this column holds only two sections,
            so the slack lands in a single ~20% hole between them, which reads
            as a rendering fault. Trailing space is the lesser evil here. */}
        <div>
          <BannerSection title="Profile" accent={accent}><Paragraph>{model.summary}</Paragraph></BannerSection>
          <BannerSection title="Experience" accent={accent}><ExperienceList items={model.experience.slice(0, 2)} accent={secondary} /></BannerSection>
        </div>
        <div>
          {model.experience.length > 2 && <BannerSection title="Earlier Roles" accent={accent}><ExperienceList items={model.experience.slice(2)} accent={secondary} /></BannerSection>}
          <BannerSection title="Education" accent={accent}><EducationList items={model.education} /></BannerSection>
          <BannerSection title="Skills" accent={accent}><SkillChips skills={model.skills} accent={accent} filled /></BannerSection>
          <div className="grid grid-cols-2 gap-6">
            {model.languages.length > 0 && <BannerSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></BannerSection>}
            {model.references.length > 0 && <BannerSection title="References" accent={accent}><RefList items={model.references.slice(0, 1)} /></BannerSection>}
          </div>
        </div>
      </div>
    </Page>
  )
}

function BannerSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 border-b-2 pb-1.5 text-[12.5px] font-black uppercase tracking-[0.18em] text-gray-900" style={{ borderColor: accent }}>{title}</h2>
      {children}
    </section>
  )
}

// Duo

function DuoResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex">
      <main className="flex-1 py-11 pl-11 pr-8">
        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: accent }}>{model.title}</p>
          <h1 className="mt-2 text-[42px] font-black leading-none text-gray-900">{model.name}</h1>
        </header>
        <MainSection title="Profile" accent={accent}><Paragraph>{model.summary}</Paragraph></MainSection>
        <MainSection title="Experience" accent={accent}><ExperienceList items={model.experience} accent="#1f2937" /></MainSection>
        {model.projects.length > 0 && <MainSection title="Projects" accent={accent}><ProjectList items={model.projects} accent="#1f2937" /></MainSection>}
        {model.references.length > 0 && <MainSection title="References" accent={accent}><div className="grid grid-cols-2 gap-4"><RefList items={[model.references[0]]} />{model.references[1] && <RefList items={[model.references[1]]} />}</div></MainSection>}
      </main>
      <aside className="w-[250px] shrink-0 px-7 py-11" style={{ backgroundColor: secondary }}>
        <div className="mb-7 flex justify-center"><Avatar model={model} size={116} ring={accent} /></div>
        <SideSection title="Contact" accent={accent}><ContactChips model={model} chipBg={accent} chipColor="#ffffff" textClass="text-gray-700" /></SideSection>
        <SideSection title="Education" accent={accent}><EducationList items={model.education} /></SideSection>
        <SideSection title="Skills" accent={accent}><SkillBars skills={model.skills} accent={accent} track="rgba(0,0,0,0.08)" labelClass="text-gray-700" /></SideSection>
        {model.languages.length > 0 && <SideSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></SideSection>}
      </aside>
    </Page>
  )
}

// Monogram

function MonogramResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="p-12" style={{ color: secondary }}>
      <header className="flex items-center gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center text-4xl font-bold text-white" style={{ backgroundColor: accent, fontFamily: SERIF }}>
          {initials(model.name)}
        </div>
        <div className="flex-1">
          <h1 className="text-[36px] font-semibold leading-tight" style={{ fontFamily: SERIF }}>{model.name}</h1>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">{model.title}</p>
        </div>
        <div className="max-w-[220px]"><ContactStrip model={model} className="justify-end text-right" /></div>
      </header>
      <div className="mt-7 space-y-[3px]">
        <div className="h-px w-full" style={{ backgroundColor: secondary }} />
        <div className="h-px w-full" style={{ backgroundColor: `${accent}88` }} />
      </div>
      <section className="mt-7">
        <MonogramHeading title="Profile" accent={accent} />
        <Paragraph>{model.summary}</Paragraph>
      </section>
      <section className="mt-7">
        <MonogramHeading title="Experience" accent={accent} />
        <ExperienceList items={model.experience} accent={secondary} />
      </section>
      <section className="mt-7">
        <MonogramHeading title="Skills" accent={accent} />
        <SkillChips skills={model.skills} accent={accent} />
      </section>
      <div className="mt-7 grid grid-cols-3 gap-8">
        <section>
          <MonogramHeading title="Education" accent={accent} />
          <EducationList items={model.education} />
        </section>
        {model.certifications.length > 0 && (
          <section>
            <MonogramHeading title="Certifications" accent={accent} />
            <CertList items={model.certifications} />
          </section>
        )}
        {model.languages.length > 0 && (
          <section>
            <MonogramHeading title="Languages" accent={accent} />
            <LanguageStars items={model.languages} accent={accent} />
          </section>
        )}
      </div>
    </Page>
  )
}

function MonogramHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.24em]">
      <span className="h-3.5 w-1" style={{ backgroundColor: accent }} />
      {title}
    </h2>
  )
}

// Split

function SplitResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex flex-col">
      <header className="grid grid-cols-2">
        <div className="flex min-h-[150px] flex-col justify-center px-10 py-8 text-white" style={{ backgroundColor: secondary }}>
          <h1 className="text-[34px] font-semibold leading-tight" style={{ fontFamily: SERIF }}>{model.name}</h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>{model.title}</p>
        </div>
        <div className="flex flex-col justify-center px-9 py-8" style={{ backgroundColor: accent }}>
          <div className="space-y-1.5 text-[10px] font-medium text-white">
            {contactItems(model).map(({ icon: Icon, text }) => (
              <p key={text} className="flex items-center gap-2"><Icon size={10} />{text}</p>
            ))}
          </div>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-[1fr_230px] gap-9 px-10 py-9">
        <main className="flex flex-col [&>section:last-child]:mb-0">
          <SplitSection title="About" accent={accent}><Paragraph>{model.summary}</Paragraph></SplitSection>
          <SplitSection title="Experience" accent={accent}><ExperienceList items={model.experience} accent={secondary} /></SplitSection>
          {model.projects.length > 0 && <SplitSection title="Projects" accent={accent}><ProjectList items={model.projects} accent={secondary} /></SplitSection>}
        </main>
        <aside className="flex flex-col [&>section:last-child]:mb-0">
          <SplitSection title="Education" accent={accent}><EducationList items={model.education} /></SplitSection>
          <SplitSection title="Skills" accent={accent}><SkillBars skills={model.skills} accent={accent} track="rgba(0,0,0,0.08)" labelClass="text-gray-700" /></SplitSection>
          {model.languages.length > 0 && <SplitSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></SplitSection>}
          {model.references.length > 0 && <SplitSection title="References" accent={accent}><RefList items={model.references.slice(0, 1)} /></SplitSection>}
        </aside>
      </div>
    </Page>
  )
}

function SplitSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-[12.5px] font-black uppercase tracking-[0.22em] text-gray-900">
        {title}
        <span className="mt-1 block h-[3px] w-8" style={{ backgroundColor: accent }} />
      </h2>
      {children}
    </section>
  )
}

// Compact

function CompactResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-12 py-10" style={{ color: secondary }}>
      <header className="text-center">
        <h1 className="text-[30px] font-black uppercase tracking-[0.12em]" style={{ color: secondary }}>{model.name}</h1>
        <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>{model.title}</p>
        <ContactStrip model={model} className="mt-3 justify-center" />
      </header>
      <div className="mt-5 h-[2px] w-full" style={{ backgroundColor: accent }} />
      <CompactSection title="Summary" accent={accent}><Paragraph>{model.summary}</Paragraph></CompactSection>
      <CompactSection title="Experience" accent={accent}>
        <div className="space-y-4">
          {model.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[12px] font-bold">{exp.title || exp.jobTitle || 'Job Title'} <span className="font-normal italic text-gray-500">· {exp.company || 'Company'}</span></h3>
                <p className="shrink-0 text-[10px] font-semibold" style={{ color: accent }}>{expDates(exp)}</p>
              </div>
              <BulletLines text={exp.description} accent={accent} />
            </div>
          ))}
        </div>
      </CompactSection>
      <CompactSection title="Education" accent={accent}>
        <div className="grid grid-cols-2 gap-6"><EducationList items={[model.education[0]].filter(Boolean)} />{model.education[1] && <EducationList items={[model.education[1]]} />}</div>
      </CompactSection>
      <div className="mt-2 grid grid-cols-3 gap-7">
        <CompactSection title="Skills" accent={accent}><SkillList skills={model.skills} accent={accent} /></CompactSection>
        {model.languages.length > 0 && <CompactSection title="Languages" accent={accent}><LanguageStars items={model.languages} accent={accent} /></CompactSection>}
        {model.certifications.length > 0 && <CompactSection title="Certifications" accent={accent}><CertList items={model.certifications} /></CompactSection>}
      </div>
    </Page>
  )
}

function CompactSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2.5 text-[11.5px] font-black uppercase tracking-[0.24em]" style={{ color: accent }}>{title}</h2>
      {children}
    </section>
  )
}

// Elegant

function ElegantResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-16 py-14" style={{ color: secondary, fontFamily: SERIF }}>
      <header className="text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500">{model.title}</p>
        <h1 className="mt-3 text-[46px] font-medium leading-tight" style={{ color: secondary }}>{model.name}</h1>
        <ContactStrip model={model} className="mt-4 justify-center font-sans" />
      </header>
      <ElegantDivider accent={accent} />
      <section className="text-center">
        <p className="mx-auto max-w-[520px] whitespace-pre-wrap text-[11.5px] italic leading-6 text-gray-600">{model.summary}</p>
      </section>
      <ElegantDivider accent={accent} />
      <section>
        <ElegantHeading title="Experience" accent={accent} />
        <div className="space-y-6">
          {model.experience.map((exp) => (
            <div key={exp.id} className="text-center">
              <h3 className="text-[13.5px] font-semibold">{exp.title || exp.jobTitle || 'Job Title'}</h3>
              <p className="text-[11px] italic text-gray-500">{exp.company || 'Company'}{exp.location ? `, ${exp.location}` : ''} · {expDates(exp)}</p>
              <ul className="mx-auto mt-2 max-w-[520px] space-y-1 text-left font-sans text-[11px] leading-5 text-gray-600">
                {splitLines(exp.description || 'Describe your impact, responsibilities, and achievements.').map((line) => (
                  <li key={line} className="flex gap-2"><span style={{ color: accent }}>—</span><span>{line}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <ElegantDivider accent={accent} />
      <div className="grid grid-cols-2 gap-12 font-sans">
        <section>
          <ElegantHeading title="Education" accent={accent} small />
          <EducationList items={model.education} />
        </section>
        <section>
          <ElegantHeading title="Skills & Languages" accent={accent} small />
          <SkillList skills={model.skills.slice(0, 5)} accent={accent} />
          {model.languages.length > 0 && <div className="mt-4"><LanguageStars items={model.languages} accent={accent} /></div>}
        </section>
      </div>
    </Page>
  )
}

function ElegantHeading({ title, accent, small = false }: { title: string; accent: string; small?: boolean }) {
  return (
    <div className={cn('flex items-center justify-center gap-4', small ? 'mb-4' : 'mb-6')}>
      <span className="h-px w-12" style={{ backgroundColor: `${accent}88` }} />
      <h2 className={cn('uppercase tracking-[0.4em]', small ? 'text-[10.5px]' : 'text-[12px]')} style={{ color: accent, fontFamily: SERIF }}>{title}</h2>
      <span className="h-px w-12" style={{ backgroundColor: `${accent}88` }} />
    </div>
  )
}

function ElegantDivider({ accent }: { accent: string }) {
  return (
    <div className="my-7 flex items-center justify-center gap-2">
      <span className="h-px w-32 bg-gray-200" />
      <span className="h-1 w-1 rotate-45" style={{ backgroundColor: accent }} />
      <span className="h-px w-32 bg-gray-200" />
    </div>
  )
}

// Shared sections

function MainSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-4 flex items-center gap-4 text-[15px] font-black uppercase tracking-widest">
        <span>{title}</span>
        <span className="h-px flex-1" style={{ backgroundColor: accent }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
      </h2>
      {children}
    </section>
  )
}

function SimpleSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>{title}</h2>
      {children}
    </section>
  )
}

function AtsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wide text-gray-950">{title}</h2>
      {children}
    </section>
  )
}

function SideSection({ title, accent, dark = false, children }: { title: string; accent: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className={cn('mb-4 flex items-center gap-3 text-[12px] font-black uppercase tracking-widest', dark && 'text-white')}>
        <span>{title}</span>
        <span className="h-px flex-1" style={{ backgroundColor: accent }} />
      </h2>
      {children}
    </section>
  )
}

// Helpers

function splitLines(text: string) {
  return text.split('\n').map((line) => line.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
}

function cleanUrl(value: string) {
  return value.replace(/^https?:\/\//, '')
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'YN'
}

function skillWidth(level: Skill['level']) {
  if (level === 'beginner') return '25%'
  if (level === 'intermediate') return '50%'
  if (level === 'advanced') return '75%'
  return '100%'
}

// Portrait layouts

function Portrait({ model, className, style }: { model: PreviewModel; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('relative overflow-hidden bg-gray-200', className)} style={style}>
      {model.photo ? (
        // Bias rectangular portrait crops toward the face.
        <Image
          src={model.photo}
          alt={model.name}
          fill
          unoptimized
          className="object-cover"
          style={{ objectPosition: '50% 14%', transform: 'scale(1.1)', transformOrigin: '50% 14%' }}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">
          {initials(model.name)}
        </span>
      )}
    </div>
  )
}

// Aperture
function ApertureResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page style={{ color: secondary }}>
      <header className="relative h-[300px] w-full">
        <Portrait model={model} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 25%, ${secondary}f2 100%)` }} />
        <div className="absolute inset-x-0 bottom-0 px-12 pb-7">
          <h1 className="text-[40px] font-semibold leading-none tracking-tight text-white" style={{ fontFamily: SERIF }}>{model.name}</h1>
          <p className="mt-2.5 text-[10.5px] font-bold uppercase tracking-[0.32em]" style={{ color: accent }}>{model.title}</p>
        </div>
      </header>
      <div className="px-12 py-4" style={{ backgroundColor: `${accent}14` }}>
        <ContactStrip model={model} />
      </div>
      <div className="grid grid-cols-[1fr_215px] gap-9 px-12 py-8">
        <main>
          <ApertureHeading title="Profile" accent={accent} /><Paragraph>{model.summary}</Paragraph>
          <ApertureHeading title="Experience" accent={accent} className="mt-6" />
          <ExperienceList items={model.experience} accent={accent} datePill />
          {model.projects.length > 0 && (<><ApertureHeading title="Projects" accent={accent} className="mt-6" /><ProjectList items={model.projects} accent={accent} /></>)}
        </main>
        <SideColumn>
          <div><ApertureHeading title="Education" accent={accent} /><EducationList items={model.education} /></div>
          <div><ApertureHeading title="Skills" accent={accent} /><SkillList skills={model.skills} accent={accent} /></div>
          {model.languages.length > 0 && (<div><ApertureHeading title="Languages" accent={accent} /><LanguageStars items={model.languages} accent={accent} /></div>)}
          {model.certifications.length > 0 && (<div><ApertureHeading title="Certifications" accent={accent} /><CertList items={model.certifications} /></div>)}
        </SideColumn>
      </div>
    </Page>
  )
}

function ApertureHeading({ title, accent, className }: { title: string; accent: string; className?: string }) {
  return (
    <h2 className={cn('mb-2.5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.26em]', className)} style={{ color: accent }}>
      {title}<span className="h-px flex-1" style={{ backgroundColor: `${accent}44` }} />
    </h2>
  )
}

// Facet
function FacetResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: secondary }}>
      <div className="relative w-[240px] shrink-0">
        <Portrait model={model} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${secondary}22 0%, ${secondary}f5 62%)` }} />
        <div className="absolute inset-x-0 bottom-0 space-y-5 p-7 text-white">
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>Contact</h2>
            <div className="mt-2 space-y-1 text-[9.5px] leading-relaxed text-white/85">
              {model.phone && <p>{model.phone}</p>}{model.email && <p className="break-all">{model.email}</p>}
              {model.location && <p>{model.location}</p>}{model.website && <p className="break-all">{model.website}</p>}
            </div>
          </div>
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>Skills</h2>
            <div className="mt-2"><SkillBars skills={model.skills.slice(0, 6)} accent={accent} /></div>
          </div>
          {model.languages.length > 0 && (
            <div>
              <h2 className="text-[9px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>Languages</h2>
              <div className="mt-2"><LanguageStars items={model.languages} accent={accent} dark /></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 px-10 py-11">
        <h1 className="text-[36px] font-semibold leading-[1.05] tracking-tight" style={{ fontFamily: SERIF, color: secondary }}>{model.name}</h1>
        <p className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>{model.title}</p>
        <div className="mt-5 h-[2px] w-16" style={{ backgroundColor: accent }} />
        <div className="mt-6"><Paragraph>{model.summary}</Paragraph></div>
        <ApertureHeading title="Experience" accent={accent} className="mt-7" />
        <ExperienceList items={model.experience} accent={accent} />
        <ApertureHeading title="Education" accent={accent} className="mt-6" />
        <EducationList items={model.education} />
        {model.certifications.length > 0 && (<><ApertureHeading title="Certifications" accent={accent} className="mt-6" /><CertList items={model.certifications} /></>)}
        {model.references.length > 0 && (<><ApertureHeading title="References" accent={accent} className="mt-6" /><RefList items={model.references} /></>)}
      </div>
    </Page>
  )
}

// Halo
function HaloResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-14 py-11" style={{ color: secondary }}>
      <header className="flex flex-col items-center text-center">
        <div className="rounded-full p-[3px]" style={{ backgroundColor: accent }}>
          <Portrait model={model} className="h-[132px] w-[132px] rounded-full border-[3px] border-white" />
        </div>
        <h1 className="mt-5 text-[34px] font-semibold leading-none tracking-tight" style={{ fontFamily: SERIF, color: secondary }}>{model.name}</h1>
        <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.34em]" style={{ color: accent }}>{model.title}</p>
        <div className="mt-4 flex items-center gap-2.5">
          <span className="h-px w-16" style={{ backgroundColor: `${accent}66` }} />
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
          <span className="h-px w-16" style={{ backgroundColor: `${accent}66` }} />
        </div>
        <ContactStrip model={model} className="mt-4 justify-center" />
      </header>
      <div className="mt-8"><HaloHeading title="Profile" accent={accent} secondary={secondary} /><Paragraph>{model.summary}</Paragraph></div>
      <div className="mt-7 grid grid-cols-[1fr_1fr] gap-9">
        <div>
          <HaloHeading title="Experience" accent={accent} secondary={secondary} />
          <ExperienceList items={model.experience} accent={accent} />
        </div>
        <SideColumn>
          <div>
            <HaloHeading title="Education" accent={accent} secondary={secondary} />
            <EducationList items={model.education} />
          </div>
          <div>
            <HaloHeading title="Skills" accent={accent} secondary={secondary} />
            <SkillChips skills={model.skills} accent={accent} filled />
          </div>
          {model.languages.length > 0 && (
            <div>
              <HaloHeading title="Languages" accent={accent} secondary={secondary} />
              <LanguageStars items={model.languages} accent={accent} />
            </div>
          )}
          {model.certifications.length > 0 && (
            <div>
              <HaloHeading title="Certifications" accent={accent} secondary={secondary} />
              <CertList items={model.certifications} />
            </div>
          )}
        </SideColumn>
      </div>
    </Page>
  )
}

/**
 * A column that carries its own weight next to a long main column.
 *
 * An earlier version of this spread the sections apart with
 * `justify-between` so the last one touched the bottom of the page. That
 * measured full and looked empty: the reader sees holes between sections, not
 * a filled column. The owner's reference CVs fill their sidebars the real way
 * — enough content, at normal spacing — so this just packs, and each layout is
 * responsible for giving its short column enough to say.
 *
 * A vertical skills LIST is the usual answer: ten skills as list items is
 * roughly a third of a page, where the same ten as chips is three lines.
 */
function SideColumn({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-5', className)}>{children}</div>
}

function HaloHeading({ title, accent, secondary, className }: { title: string; accent: string; secondary: string; className?: string }) {
  return (
    <h2 className={cn('mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em]', className)} style={{ fontFamily: SERIF, color: secondary }}>
      {title}
      <span className="mx-auto mt-1.5 block h-px w-10" style={{ backgroundColor: accent }} />
    </h2>
  )
}

// Atrium
function AtriumResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page style={{ color: secondary }}>
      <header className="relative h-[186px] px-12 pt-10" style={{ backgroundColor: secondary }}>
        <div className="pr-[170px]">
          <h1 className="text-[34px] font-semibold leading-tight tracking-tight text-white" style={{ fontFamily: SERIF }}>{model.name}</h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>{model.title}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[9.5px] text-white/70">
            {model.phone && <span>{model.phone}</span>}{model.email && <span>{model.email}</span>}
            {model.location && <span>{model.location}</span>}{model.linkedin && <span>{model.linkedin}</span>}
          </div>
        </div>
        <div className="absolute right-12 top-9 rounded-lg p-[3px]" style={{ backgroundColor: accent }}>
          <Portrait model={model} className="h-[140px] w-[124px] rounded-md" />
        </div>
      </header>
      <div className="h-[5px] w-full" style={{ backgroundColor: accent }} />
      <div className="grid grid-cols-[1fr_205px] gap-9 px-12 py-8">
        <main>
          <ApertureHeading title="Profile" accent={accent} /><Paragraph>{model.summary}</Paragraph>
          <ApertureHeading title="Experience" accent={accent} className="mt-6" />
          <ExperienceList items={model.experience} accent={accent} datePill />
          {model.references.length > 0 && (<><ApertureHeading title="References" accent={accent} className="mt-6" /><RefList items={model.references} /></>)}
        </main>
        <SideColumn>
          <div><ApertureHeading title="Education" accent={accent} /><EducationList items={model.education} /></div>
          <div><ApertureHeading title="Expertise" accent={accent} /><SkillList skills={model.skills} accent={accent} /></div>
          {model.languages.length > 0 && (<div><ApertureHeading title="Languages" accent={accent} /><LanguageStars items={model.languages} accent={accent} /></div>)}
          {model.certifications.length > 0 && (<div><ApertureHeading title="Certifications" accent={accent} /><CertList items={model.certifications} /></div>)}
        </SideColumn>
      </div>
    </Page>
  )
}

// Vista
function VistaResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page style={{ color: secondary }}>
      <header className="px-12 pt-11 pb-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[42px] font-semibold leading-none tracking-tight" style={{ fontFamily: SERIF, color: secondary }}>{model.name}</h1>
            <p className="mt-3 text-[10.5px] font-bold uppercase tracking-[0.32em]" style={{ color: accent }}>{model.title}</p>
          </div>
          <div className="shrink-0 text-right text-[9.5px] leading-relaxed text-gray-500">
            {model.phone && <p>{model.phone}</p>}{model.email && <p>{model.email}</p>}
            {model.location && <p>{model.location}</p>}{model.website && <p>{model.website}</p>}
          </div>
        </div>
      </header>
      <div className="relative h-[150px] w-full">
        <Portrait model={model} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent 40%, ${accent}33 100%)` }} />
      </div>
      <div className="h-[4px] w-full" style={{ backgroundColor: accent }} />
      <div className="px-12 py-7">
        <Paragraph>{model.summary}</Paragraph>
        <div className="mt-7 grid grid-cols-[1fr_220px] gap-9">
          <main>
            <ApertureHeading title="Experience" accent={accent} />
            <ExperienceList items={model.experience} accent={accent} />
            {model.projects.length > 0 && (<><ApertureHeading title="Projects" accent={accent} className="mt-6" /><ProjectList items={model.projects} accent={accent} /></>)}
          </main>
          <SideColumn>
            <div><ApertureHeading title="Education" accent={accent} /><EducationList items={model.education} /></div>
            <div><ApertureHeading title="Skills" accent={accent} /><SkillChips skills={model.skills} accent={accent} /></div>
            {model.languages.length > 0 && (<div><ApertureHeading title="Languages" accent={accent} /><LanguageStars items={model.languages} accent={accent} /></div>)}
            {model.certifications.length > 0 && (<div><ApertureHeading title="Certifications" accent={accent} /><CertList items={model.certifications} /></div>)}
          </SideColumn>
        </div>
      </div>
    </Page>
  )
}

// Shared timeline
function TimelineRail({ items, accent, secondary }: { items: WorkExperience[]; accent: string; secondary: string }) {
  return (
    <div className="relative space-y-4 pl-5">
      <span className="absolute left-[3.5px] top-2 bottom-2 w-px" style={{ backgroundColor: `${accent}44` }} />
      {items.map((exp) => (
        <div key={exp.id} className="relative">
          <span className="absolute -left-5 top-[5px] h-2 w-2 rounded-full ring-2 ring-white" style={{ backgroundColor: accent }} />
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[12px] font-bold" style={{ color: secondary }}>{exp.title || exp.jobTitle || 'Job Title'}</h3>
            <p className="shrink-0 text-[9px] font-semibold" style={{ color: accent }}>{expDates(exp)}</p>
          </div>
          <p className="text-[10px] text-gray-500">{exp.company || 'Company'}{exp.location ? ` | ${exp.location}` : ''}</p>
          <BulletLines text={exp.description} accent={accent} />
        </div>
      ))}
    </div>
  )
}

function PanelHeading({ title, color, className }: { title: string; color: string; className?: string }) {
  return (
    <h2 className={cn('mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em]', className)} style={{ color }}>
      {title}
    </h2>
  )
}

// Vertex
function VertexResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex bg-[#0d0d0f] text-white">
      <div className="flex flex-1 flex-col gap-7 px-10 py-11">
        <div>
        <h1 className="text-[46px] font-extrabold uppercase leading-[0.92] tracking-tight">
          {model.name.split(' ')[0]}<br />{model.name.split(' ').slice(1).join(' ')}
        </h1>
        <span className="mt-5 inline-block rounded-sm px-4 py-2 text-[11px] font-semibold tracking-wide text-black" style={{ backgroundColor: accent }}>
          {model.title}
        </span>
        <div className="mt-8"><PanelHeading title="Education" color={accent} /><div className="space-y-2.5">
          {model.education.map((e) => (
            <div key={e.id} className="flex gap-3">
              <span className="mt-[3px] shrink-0 rounded-sm px-1.5 py-0.5 text-[8.5px] font-bold text-black" style={{ backgroundColor: accent }}>{[e.startDate, e.endDate].filter(Boolean).join('–') || '—'}</span>
              <div><p className="text-[11px] font-bold uppercase">{e.school || 'University'}</p><p className="text-[9.5px] text-white/55">{e.degree || 'Degree'}</p></div>
            </div>
          ))}
        </div></div>
        </div>
        <div><PanelHeading title="Experience" color={accent} /><div className="space-y-3.5">
          {model.experience.map((x) => (
            <div key={x.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[11px] font-bold">{x.title || x.jobTitle || 'Job Title'}</p>
                <p className="shrink-0 text-[8.5px] font-semibold" style={{ color: accent }}>{expDates(x)}</p>
              </div>
              <p className="text-[9.5px] italic text-white/50">{x.company || 'Company'}</p>
              <ul className="mt-1 space-y-0.5">
                {(x.description || '').split('\n').filter(Boolean).map((line, i) => (
                  <li key={i} className="text-[9px] leading-relaxed text-white/60">— {line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div></div>
        <div><PanelHeading title="Skills" color={accent} />
          <div className="flex flex-wrap gap-1.5">
            {model.skills.slice(0, 8).map((s) => (
              <span key={s.id} className="rounded-full border px-2.5 py-1 text-[9px]" style={{ borderColor: `${accent}77`, color: accent }}>{s.name}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-[290px] shrink-0 flex-col px-6 py-8" style={{ background: `linear-gradient(160deg, ${accent}, #0d0d0f 78%)` }}>
        <Portrait model={model} className="h-[300px] w-full shrink-0 rounded-md" />
        <div className="mt-3 flex flex-1 flex-col gap-5">
          <div><PanelHeading title="About Me" color="#fff" /><p className="text-[10.5px] leading-relaxed text-white/75">{model.summary}</p></div>
          <div><PanelHeading title="Language" color="#fff" /><SkillBars skills={model.languages.map((l, i) => ({ id: String(i), name: l.name, level: 'expert' as const }))} accent="#fff" track="rgba(255,255,255,.25)" /></div>
          {model.certifications.length > 0 && (
            <div><PanelHeading title="Certifications" color="#fff" />
              <div className="space-y-2.5">
                {model.certifications.map((c) => (
                  <div key={c.id} className="text-[10.5px] leading-relaxed">
                    <p className="font-semibold text-white/90">{c.name}</p>
                    <p className="text-white/55">{[c.issuer, c.date].filter(Boolean).join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {model.references.length > 0 && (
            <div><PanelHeading title="References" color="#fff" />
              <div className="space-y-2.5">
                {model.references.map((r) => (
                  <div key={r.id} className="text-[10.5px] leading-relaxed">
                    <p className="font-semibold text-white/90">{r.name}</p>
                    <p className="text-white/55">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div><PanelHeading title="Contact" color="#fff" />
            <div className="space-y-1.5 text-[10.5px] text-white/80">
              {model.phone && <p>{model.phone}</p>}{model.email && <p className="break-all">{model.email}</p>}{model.location && <p>{model.location}</p>}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

// Meridian
function MeridianResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: secondary }}>
      <aside className="flex w-[252px] shrink-0 flex-col px-7 py-9 text-white" style={{ backgroundColor: secondary }}>
        <div className="flex justify-center"><Portrait model={model} className="h-[124px] w-[124px] rounded-full ring-4" style={{ boxShadow: `0 0 0 4px ${accent}` }} /></div>
        <div className="mt-7 flex flex-1 flex-col gap-6">
          <div><PanelHeading title="Contact" color={accent} />
            <div className="space-y-2 text-[10.5px] leading-relaxed text-white/80">
              {model.phone && <p>{model.phone}</p>}{model.email && <p className="break-all">{model.email}</p>}
              {model.location && <p>{model.location}</p>}{model.website && <p className="break-all">{model.website}</p>}
            </div>
          </div>
          <div><PanelHeading title="Education" color={accent} />
            <div className="space-y-3">
              {model.education.map((e) => (
                <div key={e.id}><p className="text-[11px] font-bold leading-snug">{e.degree || 'Degree'}</p><p className="text-[10px] text-white/60">{e.school}</p><p className="text-[9.5px] text-white/45">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</p></div>
              ))}
            </div>
          </div>
          <div><PanelHeading title="Skills" color={accent} /><SkillBars skills={model.skills} accent={accent} /></div>
          {model.languages.length > 0 && <div><PanelHeading title="Languages" color={accent} /><LanguageStars items={model.languages} accent={accent} dark /></div>}
          {model.certifications.length > 0 && (
            <div><PanelHeading title="Certifications" color={accent} />
              <div className="space-y-2.5">
                {model.certifications.map((c) => (
                  <div key={c.id} className="text-[10.5px] leading-relaxed">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-white/55">{[c.issuer, c.date].filter(Boolean).join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
      <div className="flex flex-1 flex-col px-10 py-12">
        <h1 className="text-[42px] font-extrabold uppercase leading-[0.95] tracking-tight" style={{ color: secondary }}>{model.name}</h1>
        <p className="mt-3.5 text-[12px] font-semibold uppercase tracking-[0.32em]" style={{ color: accent }}>{model.title}</p>
        <div className="mt-9"><PanelHeading title="About Me" color={secondary} /><Paragraph>{model.summary}</Paragraph></div>
        <div className="mt-10 flex-1"><PanelHeading title="Experience" color={secondary} /><TimelineRail items={model.experience} accent={accent} secondary={secondary} /></div>
        {model.references.length > 0 && <div className="mt-10"><PanelHeading title="References" color={secondary} /><RefList items={model.references} /></div>}
      </div>
    </Page>
  )
}

// Crest
function CrestResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex flex-col" style={{ color: secondary }}>
      <header className="flex items-center gap-7 px-11 py-8" style={{ backgroundColor: secondary }}>
        <Portrait model={model} className="h-[118px] w-[118px] shrink-0 rounded-full ring-4 ring-white/25" />
        <div className="min-w-0">
          <h1 className="text-[33px] font-extrabold uppercase leading-none tracking-tight text-white">{model.name}</h1>
          <p className="mt-2.5 text-[11.5px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>{model.title}</p>
        </div>
      </header>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-11 py-3 text-[9.5px] text-white" style={{ backgroundColor: accent }}>
        {model.phone && <span>{model.phone}</span>}{model.email && <span>{model.email}</span>}
        {model.location && <span>{model.location}</span>}{model.website && <span>{model.website}</span>}
      </div>
      <div className="grid flex-1 grid-cols-[210px_1fr] gap-8 px-11 py-8">
        <aside className="flex flex-col gap-6">
          <div><PanelHeading title="Education" color={accent} /><EducationList items={model.education} /></div>
          <div><PanelHeading title="Skills" color={accent} /><SkillBars skills={model.skills.slice(0, 7)} accent={accent} track="#e5e7eb" labelClass="text-gray-700" /></div>
          {model.languages.length > 0 && <div><PanelHeading title="Languages" color={accent} /><LanguageStars items={model.languages} accent={accent} /></div>}
        </aside>
        <main className="flex flex-col gap-6">
          <div><PanelHeading title="Profile" color={accent} /><Paragraph>{model.summary}</Paragraph></div>
          <div><PanelHeading title="Experience" color={accent} /><TimelineRail items={model.experience} accent={accent} secondary={secondary} /></div>
          {model.references.length > 0 && <div><PanelHeading title="References" color={accent} /><RefList items={model.references} /></div>}
        </main>
      </div>
    </Page>
  )
}

// Obsidian
function ObsidianResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex">
      <aside className="flex w-[248px] shrink-0 flex-col bg-[#111113] px-7 py-8 text-white">
        <Portrait model={model} className="h-[150px] w-full rounded-sm" />
        <div className="mt-7 flex flex-1 flex-col gap-6">
          <div><PanelHeading title="About Me" color={accent} /><p className="text-[10.5px] leading-relaxed text-white/70">{model.summary}</p></div>
          <div><PanelHeading title="Education" color={accent} />
            <div className="space-y-2.5">
              {model.education.map((e) => (
                <div key={e.id}><p className="text-[11px] font-bold leading-snug">{e.degree || 'Degree'}</p><p className="text-[10px] text-white/55">{e.school}</p></div>
              ))}
            </div>
          </div>
          <div><PanelHeading title="Skills" color={accent} /><SkillBars skills={model.skills} accent="#ffffff" track="rgba(255,255,255,.22)" /></div>
          {model.languages.length > 0 && <div><PanelHeading title="Languages" color={accent} /><ul className="space-y-1.5 text-[10.5px] text-white/75">{model.languages.map((l, i) => <li key={i}>• {l.name}</li>)}</ul></div>}
          {model.certifications.length > 0 && (
            <div><PanelHeading title="Certifications" color={accent} />
              <div className="space-y-2.5">
                {model.certifications.map((c) => (
                  <div key={c.id} className="text-[10.5px] leading-relaxed">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-white/55">{[c.issuer, c.date].filter(Boolean).join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
      <div className="flex-1 px-9 py-9">
        <h1 className="text-[36px] font-extrabold uppercase leading-none tracking-tight text-[#111113]">{model.name}</h1>
        <p className="mt-2 text-[13px] font-light tracking-[0.2em] text-gray-500">{model.title}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[9.5px] text-gray-600">
          {model.phone && <span>{model.phone}</span>}{model.email && <span>{model.email}</span>}{model.location && <span>{model.location}</span>}
        </div>
        <div className="mt-7"><PanelHeading title="Experience" color="#111113" /><TimelineRail items={model.experience} accent={accent} secondary="#111113" /></div>
        {model.references.length > 0 && <div className="mt-7"><PanelHeading title="References" color="#111113" /><RefList items={model.references} /></div>}
      </div>
    </Page>
  )
}

// Solstice
function SolsticeResume({ model }: { model: PreviewModel }) {
  // No `secondary` here on purpose: this layout is panel-family, so secondary
  // is a pale background tint and there is no panel in this design to use it on.
  const { accent } = model.template
  return (
    <Page className="flex flex-col" style={{ color: INK }}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-10 py-2.5 text-[9.5px] text-white" style={{ backgroundColor: accent }}>
        {model.phone && <span>{model.phone}</span>}{model.email && <span>{model.email}</span>}{model.location && <span>{model.location}</span>}
      </div>
      <div className="grid flex-1 grid-cols-[268px_1fr]">
        <div className="flex flex-col px-9 py-8">
          <Portrait model={model} className="h-[212px] w-full rounded-sm" />
          <div className="relative z-10 ml-[-14px] mr-2 px-4 py-3.5 shadow-lg" style={{ backgroundColor: accent }}>
            <h1 className="text-[27px] font-extrabold uppercase leading-[0.95] text-white">{model.name}</h1>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85">{model.title}</p>
          </div>
          <div className="mt-6 flex flex-1 flex-col gap-5">
            <div><PanelHeading title="Education" color={INK} /><EducationList items={model.education} /></div>
            <div><PanelHeading title="Skills" color={INK} /><SkillBars skills={model.skills.slice(0, 6)} accent={accent} track="#e5e7eb" labelClass="text-gray-700" /></div>
            {model.languages.length > 0 && <div><PanelHeading title="Languages" color={INK} /><LanguageStars items={model.languages} accent={accent} /></div>}
          </div>
        </div>
        <div className="flex flex-col gap-6 px-9 py-8">
          <div><PanelHeading title="About Me" color={INK} /><Paragraph>{model.summary}</Paragraph></div>
          <div><PanelHeading title="Experience" color={INK} /><TimelineRail items={model.experience} accent={accent} secondary={INK} /></div>
          {model.certifications.length > 0 && <div><PanelHeading title="Certifications" color={INK} /><CertList items={model.certifications} /></div>}
          {model.references.length > 0 && <div><PanelHeading title="References" color={INK} /><RefList items={model.references} /></div>}
        </div>
      </div>
    </Page>
  )
}

// Ledger

function LedgerResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex">
      <span className="w-[6px] shrink-0" style={{ backgroundColor: accent }} />
      <div className="flex-1 px-12 py-11" style={{ color: secondary }}>
        <header className="grid grid-cols-[110px_1fr] gap-7">
          <p className="pt-2 text-[9px] font-bold uppercase leading-relaxed tracking-[0.24em]" style={{ color: accent }}>
            Curriculum
            <br />
            Vitae
          </p>
          <div>
            <h1 className="text-[36px] font-semibold leading-[1.05] tracking-tight" style={{ fontFamily: SERIF, color: secondary }}>
              {model.name}
            </h1>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: accent }}>
              {model.title}
            </p>
            <ContactStrip model={model} className="mt-4" />
          </div>
        </header>

        <div className="mt-9 space-y-6">
          <LedgerRow label="Profile" accent={accent}>
            <Paragraph>{model.summary}</Paragraph>
          </LedgerRow>

          <LedgerRow label="Experience" accent={accent}>
            <div className="space-y-5">
              {model.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[12.5px] font-bold" style={{ color: secondary }}>
                      {exp.title || exp.jobTitle || 'Job Title'}
                    </h3>
                    <p className="shrink-0 text-[9.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
                      {expDates(exp)}
                    </p>
                  </div>
                  <p className="text-[10.5px] text-gray-500">
                    {exp.company || 'Company'}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <BulletLines text={exp.description} accent={accent} />
                </div>
              ))}
            </div>
          </LedgerRow>

          <LedgerRow label="Education" accent={accent}>
            <EducationList items={model.education} />
          </LedgerRow>

          <LedgerRow label="Skills" accent={accent}>
            <SkillChips skills={model.skills} accent={accent} />
          </LedgerRow>

          {model.certifications.length > 0 && (
            <LedgerRow label="Certifications" accent={accent}>
              <CertList items={model.certifications} />
            </LedgerRow>
          )}

          {model.languages.length > 0 && (
            <LedgerRow label="Languages" accent={accent}>
              <LanguageStars items={model.languages} accent={accent} />
            </LedgerRow>
          )}

          {model.references.length > 0 && (
            <LedgerRow label="References" accent={accent}>
              <RefList items={model.references} />
            </LedgerRow>
          )}
        </div>
      </div>
    </Page>
  )
}

function LedgerRow({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-[110px_1fr] gap-7 border-t pt-5" style={{ borderColor: `${accent}33` }}>
      <h2 className="text-[9.5px] font-bold uppercase leading-relaxed tracking-[0.2em]" style={{ color: accent }}>
        {label}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

// Gazette

function GazetteResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-11 py-10" style={{ color: secondary }}>
      <header>
        <div className="h-[3px] w-full" style={{ backgroundColor: secondary }} />
        <h1
          className="mt-4 text-center text-[38px] font-semibold uppercase leading-none tracking-[0.12em]"
          style={{ fontFamily: SERIF, color: secondary }}
        >
          {model.name}
        </h1>
        <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.36em]" style={{ color: accent }}>
          {model.title}
        </p>
        <div className="mt-4 h-px w-full" style={{ backgroundColor: `${secondary}55` }} />
        <ContactStrip model={model} className="justify-center py-2.5" />
        <div className="h-[3px] w-full" style={{ backgroundColor: secondary }} />
      </header>

      <div className="mt-6 border-b pb-5" style={{ borderColor: `${accent}40` }}>
        <p className="text-center text-[11.5px] italic leading-relaxed" style={{ fontFamily: SERIF, color: secondary }}>
          {model.summary}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 border-r pr-6" style={{ borderColor: `${accent}30` }}>
          <GazetteHeading title="Experience" accent={accent} secondary={secondary} />
          <div className="space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <h3 className="text-[12px] font-bold leading-snug" style={{ color: secondary }}>
                  {exp.title || exp.jobTitle || 'Job Title'}
                </h3>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-gray-500">
                  {exp.company || 'Company'} &middot; {expDates(exp)}
                </p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>

          {model.projects.length > 0 && (
            <>
              <GazetteHeading title="Projects" accent={accent} secondary={secondary} className="mt-6" />
              <ProjectList items={model.projects} accent={accent} />
            </>
          )}
        </div>

        <SideColumn>
          <div>
            <GazetteHeading title="Education" accent={accent} secondary={secondary} />
            <EducationList items={model.education} />
          </div>

          <div>
            <GazetteHeading title="Skills" accent={accent} secondary={secondary} />
            <SkillList skills={model.skills} accent={accent} />
          </div>

          {model.languages.length > 0 && (
            <div>
              <GazetteHeading title="Languages" accent={accent} secondary={secondary} />
              <LanguageStars items={model.languages} accent={accent} />
            </div>
          )}

          {model.certifications.length > 0 && (
            <div>
              <GazetteHeading title="Certifications" accent={accent} secondary={secondary} />
              <CertList items={model.certifications} />
            </div>
          )}
        </SideColumn>
      </div>
    </Page>
  )
}

function GazetteHeading({
  title,
  accent,
  secondary,
  className,
}: {
  title: string
  accent: string
  secondary: string
  className?: string
}) {
  return (
    <h2 className={cn('mb-3', className)}>
      <span className="block h-px w-full" style={{ backgroundColor: `${secondary}40` }} />
      <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: accent }}>
        {title}
      </span>
    </h2>
  )
}

// Capsule — outlined pill section labels, a ringed portrait, warm paper page.
function CapsuleResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="bg-[#fdfaf7] px-11 py-10" style={{ color: secondary }}>
      <div className="grid h-full grid-cols-[206px_1fr] gap-8">
        <SideColumn className="gap-5">
          <div className="flex justify-center">
            <div className="rounded-full p-[6px]" style={{ backgroundColor: `${accent}1f` }}>
              <Portrait model={model} className="h-[142px] w-[142px] rounded-full border-[3px] border-white" />
            </div>
          </div>
          <div>
            <CapsuleHeading title="about me" accent={accent} />
            <p className="text-[9.5px] leading-[1.75] text-gray-600">{model.summary}</p>
          </div>
          <div>
            <CapsuleHeading title="education" accent={accent} />
            <EducationList items={model.education} />
          </div>
          <div>
            <CapsuleHeading title="skills" accent={accent} />
            <ul className="space-y-1 text-[9.5px] text-gray-700">
              {model.skills.map((skill) => (
                <li key={skill.id} className="flex gap-1.5">
                  <span style={{ color: accent }}>&bull;</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <CapsuleHeading title="contact" accent={accent} />
            <div className="space-y-1.5 text-[9.5px] text-gray-600">
              {model.phone && <p>{model.phone}</p>}
              {model.email && <p className="break-all">{model.email}</p>}
              {model.location && <p>{model.location}</p>}
              {model.website && <p className="break-all">{model.website}</p>}
            </div>
          </div>
          {model.languages.length > 0 && (
            <div>
              <CapsuleHeading title="languages" accent={accent} />
              <LanguageStars items={model.languages} accent={accent} />
            </div>
          )}
        </SideColumn>

        <SideColumn className="gap-5">
          <header>
            <h1 className="text-[40px] font-semibold leading-[1.05] tracking-tight" style={{ fontFamily: SERIF, color: secondary }}>
              {model.name}
            </h1>
            <span
              className="mt-3 inline-block rounded-full px-4 py-[5px] text-[10px] font-medium tracking-wide"
              style={{ backgroundColor: `${accent}1f`, color: accent }}
            >
              {model.title}
            </span>
          </header>
          <div>
            <CapsuleHeading title="experience" accent={accent} />
            <ExperienceList items={model.experience} accent={accent} />
          </div>
          {model.certifications.length > 0 && (
            <div>
              <CapsuleHeading title="awards" accent={accent} />
              <CertList items={model.certifications} />
            </div>
          )}
          {model.references.length > 0 && (
            <div>
              <CapsuleHeading title="references" accent={accent} />
              <RefList items={model.references} />
            </div>
          )}
        </SideColumn>
      </div>
    </Page>
  )
}

/** The outlined lozenge that gives this layout its name. */
function CapsuleHeading({ title, accent, className }: { title: string; accent: string; className?: string }) {
  return (
    <h2 className={cn('mb-3', className)}>
      <span
        className="inline-block rounded-full border px-5 py-[5px] text-[10.5px] font-medium lowercase tracking-wide"
        style={{ borderColor: `${accent}66`, color: accent }}
      >
        {title}
      </span>
    </h2>
  )
}

// Marquee — solid heading bars with icons beside a dark rail of pill labels.
function MarqueeResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: '#1f2937' }}>
      <aside className="flex w-[232px] shrink-0 flex-col gap-5 px-6 py-8" style={{ backgroundColor: secondary }}>
        <div className="flex justify-center">
          <Portrait model={model} className="h-[150px] w-[150px] rounded-full border-[3px]" style={{ borderColor: accent }} />
        </div>
        <div>
          <PillLabel title="Contact" accent={accent} />
          <div className="space-y-2.5 text-[11px] leading-relaxed text-white/75">
            {model.phone && <p>{model.phone}</p>}
            {model.email && <p className="break-all">{model.email}</p>}
            {model.website && <p className="break-all">{model.website}</p>}
            {model.location && <p>{model.location}</p>}
          </div>
        </div>
        <div>
          <PillLabel title="Education" accent={accent} />
          <div className="space-y-3 text-[11px] leading-relaxed">
            {model.education.map((edu) => (
              <div key={edu.id}>
                <p className="font-semibold text-white">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-white/60">{edu.school || 'University Name'}</p>
                <p className="text-white/45">{[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        {model.languages.length > 0 && (
          <div>
            <PillLabel title="Languages" accent={accent} />
            <LanguageStars items={model.languages} accent={accent} dark />
          </div>
        )}
        {model.certifications.length > 0 && (
          <div>
            <PillLabel title="Certificates" accent={accent} />
            <div className="space-y-3 text-[11px] leading-relaxed">
              {model.certifications.map((cert) => (
                <div key={cert.id} className="leading-relaxed">
                  <p className="font-semibold text-white">{cert.name}</p>
                  <p className="text-white/60">{[cert.issuer, cert.date].filter(Boolean).join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {model.references.length > 0 && (
          <div>
            <PillLabel title="References" accent={accent} />
            <div className="space-y-3">
              {model.references.map((ref) => (
                <div key={ref.id} className="text-[11px] leading-relaxed">
                  <p className="font-semibold text-white">{ref.name}</p>
                  <p className="text-white/60">{[ref.title, ref.company].filter(Boolean).join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col px-9 py-8">
        <header className="mb-6">
          <h1 className="text-[33px] font-bold leading-none tracking-tight" style={{ color: secondary }}>{model.name}</h1>
          <p className="mt-2 text-[12px] font-medium" style={{ color: accent }}>{model.title}</p>
        </header>
        <SideColumn className="gap-5">
          <div>
            <BarHeading title="Profile" icon={User} accent={accent} />
            <Paragraph>{model.summary}</Paragraph>
          </div>
          <div>
            <BarHeading title="Experience" icon={Briefcase} accent={accent} />
            <ExperienceList items={model.experience} accent={secondary} />
          </div>
          <div>
            <BarHeading title="Skills" icon={Wrench} accent={accent} />
            <SkillChips skills={model.skills} accent={accent} filled />
          </div>
        </SideColumn>
      </div>
    </Page>
  )
}

/** Solid bar heading. The icon sits inside the bar, not beside it. */
function BarHeading({ title, icon: Icon, accent }: { title: string; icon: typeof User; accent: string }) {
  return (
    <h2
      className="mb-2.5 flex items-center gap-2 rounded-sm px-3 py-[6px] text-[11px] font-bold uppercase tracking-[0.16em] text-white"
      style={{ backgroundColor: accent }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {title}
    </h2>
  )
}

/** Outlined pill used for the dark rail's section names. */
function PillLabel({ title, accent }: { title: string; accent: string }) {
  return (
    <h2
      className="mb-3 mt-1 inline-block rounded-full border px-4 py-[5px] text-[11px] font-semibold uppercase tracking-[0.18em]"
      style={{ borderColor: `${accent}99`, color: accent }}
    >
      {title}
    </h2>
  )
}

// Bureau — tinted rail carrying photo, contact, education, skills and
// languages against a plain column of summary and experience.
//
// The rail earns its height with a vertical skills list and a language list,
// which is how the reference CVs keep both columns ending together. Do not
// turn those into chips; three lines of chips is what left the rail empty.
function BureauResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="w-[250px] shrink-0 px-7 py-9" style={{ backgroundColor: secondary }}>
        <div className="flex justify-center">
          <div className="rounded-full p-[3px]" style={{ backgroundColor: accent }}>
            <Portrait model={model} className="h-[132px] w-[132px] rounded-full border-[3px] border-white" />
          </div>
        </div>

        <BureauRailHeading title="Contact" />
        <div className="space-y-2 text-[10px] leading-relaxed text-gray-700">
          {model.phone && <p className="flex gap-2"><Phone size={10} className="mt-[1px] shrink-0" style={{ color: accent }} />{model.phone}</p>}
          {model.email && <p className="flex gap-2"><Mail size={10} className="mt-[1px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.email}</span></p>}
          {model.location && <p className="flex gap-2"><MapPin size={10} className="mt-[1px] shrink-0" style={{ color: accent }} />{model.location}</p>}
          {model.website && <p className="flex gap-2"><Globe size={10} className="mt-[1px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.website}</span></p>}
        </div>

        <BureauRailHeading title="Education" />
        <div className="space-y-4">
          {model.education.map((edu) => (
            <div key={edu.id} className="text-[10px] leading-relaxed">
              <p className="font-bold" style={{ color: accent }}>{edu.school || 'University Name'}</p>
              <p className="text-gray-700">{[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
              <p className="text-gray-500">{[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}</p>
            </div>
          ))}
        </div>

        <BureauRailHeading title="Key Skills" />
        <ul className="space-y-[5px] text-[10px] text-gray-700">
          {model.skills.map((skill) => (
            <li key={skill.id} className="flex gap-2">
              <span className="mt-[5px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
              {skill.name}
            </li>
          ))}
        </ul>

        {model.languages.length > 0 && (
          <>
            <BureauRailHeading title="Language" />
            <ul className="space-y-[5px] text-[10px] text-gray-700">
              {model.languages.map((lang) => (
                <li key={lang.id} className="flex gap-2">
                  <span className="mt-[5px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {lang.name}
                  <span className="text-gray-500">({lang.proficiency})</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {model.certifications.length > 0 && (
          <>
            <BureauRailHeading title="Certificates" />
            <div className="space-y-3">
              {model.certifications.map((cert) => (
                <div key={cert.id} className="text-[10px] leading-relaxed">
                  <p className="font-bold" style={{ color: accent }}>{cert.name}</p>
                  <p className="text-gray-600">{[cert.issuer, cert.date].filter(Boolean).join(' · ')}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>

      <div className="min-w-0 flex-1 px-8 py-8">
        <header>
          <h1 className="text-[30px] font-light uppercase leading-none tracking-[0.1em]" style={{ color: accent }}>{model.name}</h1>
          <p className="mt-2 text-[13px] font-light text-gray-500">{model.title}</p>
        </header>

        <BureauSectionHead title="Summary" icon={User} accent={accent} />
        <p className="text-justify text-[10px] leading-[1.7] text-gray-700">{model.summary}</p>

        <BureauSectionHead title="Work Experience" icon={Briefcase} accent={accent} />
        <div className="space-y-4">
          {model.experience.map((exp) => (
            <div key={exp.id}>
              <h3 className="text-[11px] font-bold" style={{ color: '#1f2733' }}>
                {[exp.title || exp.jobTitle || 'Job Title', exp.company].filter(Boolean).join(', ')}
              </h3>
              <p className="mt-0.5 text-[9px] text-gray-500">{expDates(exp)}</p>
              <BulletLines text={exp.description} accent={accent} />
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

/** Plain bold caps label. The rail deliberately has no rules — the tint separates it. */
function BureauRailHeading({ title }: { title: string }) {
  return <h2 className="mb-2.5 mt-6 text-[12px] font-bold uppercase tracking-[0.06em] text-[#2c3440]">{title}</h2>
}

/** Filled disc holding the icon, label beside it, rule beneath the pair. */
function BureauSectionHead({ title, icon: Icon, accent }: { title: string; icon: typeof User; accent: string }) {
  return (
    <div className="mb-3 mt-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full" style={{ backgroundColor: accent }}>
          <Icon size={11} className="text-white" strokeWidth={2.4} />
        </span>
        <h2 className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-[#2c3440]">{title}</h2>
      </div>
      <span className="mt-2 block h-px w-full" style={{ backgroundColor: `${accent}33` }} />
    </div>
  )
}

// Terminal — monospace throughout, every section a bordered block with a
// bracketed label. The only layout in the catalogue that is not set in a
// proportional face, which is the whole point of it.
function TerminalResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex gap-5 bg-[#14141f] px-8 py-8 text-white" style={{ fontFamily: MONO }}>
      <div className="flex w-[236px] shrink-0 flex-col gap-3.5">
        <TerminalBlock label="profile" accent={accent}>
          <div className="flex justify-center py-1">
            <Portrait model={model} className="h-[104px] w-[104px] rounded-sm" />
          </div>
        </TerminalBlock>
        <TerminalBlock label="contact" accent={accent}>
          <div className="space-y-1.5 text-[9.5px] text-white/70">
            {model.phone && <p>{model.phone}</p>}
            {model.email && <p className="break-all">{model.email}</p>}
            {model.location && <p>{model.location}</p>}
            {model.website && <p className="break-all">{model.website}</p>}
          </div>
        </TerminalBlock>
        <TerminalBlock label="skills" accent={accent}>
          <div className="space-y-2">
            {model.skills.map((skill) => (
              <div key={skill.id}>
                <div className="flex items-baseline justify-between text-[9.5px]">
                  <span className="text-white/80">{skill.name}</span>
                  <span style={{ color: accent }}>{skillPercent(skill.level)}%</span>
                </div>
                <div className="mt-1 h-[3px] rounded-full bg-white/12">
                  <div className="h-[3px] rounded-full" style={{ width: skillWidth(skill.level), backgroundColor: accent }} />
                </div>
              </div>
            ))}
          </div>
        </TerminalBlock>
        <TerminalBlock label="education" accent={accent}>
          <div className="space-y-2.5 text-[9.5px]">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="text-white/85">{e.school || 'University'}</p>
                <p className="text-white/50">{[e.degree, e.endDate].filter(Boolean).join(' · ')}</p>
              </div>
            ))}
          </div>
        </TerminalBlock>
        {model.languages.length > 0 && (
          <TerminalBlock label="languages" accent={accent}>
            <div className="space-y-1 text-[9.5px] text-white/70">
              {model.languages.map((l) => (
                <p key={l.id}>{l.name} <span className="text-white/40">({l.proficiency})</span></p>
              ))}
            </div>
          </TerminalBlock>
        )}
        {model.references.length > 0 && (
          <TerminalBlock label="references" accent={accent}>
            <div className="space-y-2 text-[9.5px]">
              {model.references.map((r) => (
                <div key={r.id}>
                  <p className="text-white/85">{r.name}</p>
                  <p className="text-white/50">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                </div>
              ))}
            </div>
          </TerminalBlock>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[27px] font-bold leading-none" style={{ color: accent }}>{model.name}</h1>
            <p className="mt-2 text-[11px] text-white/60">{model.title}</p>
          </div>
        </div>
        <TerminalBlock label="summary" accent={accent}>
          <p className="text-[9.5px] leading-[1.75] text-white/70">{model.summary}</p>
        </TerminalBlock>
        <TerminalBlock label="experience" accent={accent}>
          <div className="space-y-3.5">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-bold text-white">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <span className="shrink-0 rounded-sm px-1.5 py-[2px] text-[8px] font-bold text-[#14141f]" style={{ backgroundColor: accent }}>
                    {expDates(exp)}
                  </span>
                </div>
                <p className="mt-0.5 text-[9.5px] text-white/45">{exp.company || 'Company'}</p>
                <ul className="mt-1.5 space-y-1">
                  {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="flex gap-2 text-[9px] leading-relaxed text-white/60">
                      <span style={{ color: accent }}>&gt;</span>
                      {line.replace(/^[-•*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TerminalBlock>
        {model.certifications.length > 0 && (
          <TerminalBlock label="certifications" accent={accent}>
            <div className="space-y-1.5 text-[9.5px]">
              {model.certifications.map((c) => (
                <p key={c.id} className="text-white/70">
                  {c.name} <span className="text-white/40">— {[c.issuer, c.date].filter(Boolean).join(', ')}</span>
                </p>
              ))}
            </div>
          </TerminalBlock>
        )}
      </div>
    </Page>
  )
}

/** Bordered block with its label notched into the top edge. */
function TerminalBlock({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-white/12 px-3.5 pb-3 pt-2.5">
      <h2 className="mb-2 text-[9px] font-bold lowercase tracking-[0.18em]" style={{ color: accent }}>
        [{label}]
      </h2>
      {children}
    </section>
  )
}

// Gauge — dark page where skills are drawn as rings rather than bars, with the
// portrait and the quiet detail banked down the right.
function GaugeResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex bg-[#17130f] text-white">
      <div className="flex min-w-0 flex-1 flex-col gap-6 px-9 py-9">
        <header>
          <h1 className="text-[40px] font-extrabold uppercase leading-[0.92] tracking-tight">{model.name}</h1>
          <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#17130f]">
            {model.title}
          </span>
        </header>

        <section>
          <GaugeHeading title="Education" accent={accent} icon={GraduationCap} />
          <div className="relative space-y-3 pl-5">
            <span className="absolute left-[3px] top-2 bottom-2 w-px bg-white/15" />
            {model.education.map((e) => (
              <div key={e.id} className="relative flex gap-3">
                <span className="absolute -left-5 top-[5px] h-[7px] w-[7px] rounded-full" style={{ backgroundColor: accent }} />
                <span className="shrink-0 rounded-full border px-2 py-[1px] text-[8.5px] font-bold" style={{ borderColor: `${accent}88`, color: accent }}>
                  {[e.startDate, e.endDate].filter(Boolean).join('–') || '—'}
                </span>
                <div>
                  <p className="text-[10.5px] font-bold uppercase">{e.school || 'University'}</p>
                  <p className="text-[9.5px] text-white/55">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1">
          <GaugeHeading title="Experience" accent={accent} icon={Briefcase} />
          <div className="space-y-3.5">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="shrink-0 text-[8.5px] font-semibold" style={{ color: accent }}>{expDates(exp)}</p>
                </div>
                <p className="text-[9.5px] italic text-white/45">{exp.company || 'Company'}</p>
                <ul className="mt-1 space-y-[3px]">
                  {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="text-[9px] leading-relaxed text-white/60">— {line.replace(/^[-•*]\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white/5 px-5 py-4">
          <GaugeHeading title="Skills" accent={accent} icon={Wrench} />
          <div className="flex flex-wrap justify-between gap-y-3">
            {model.skills.slice(0, 5).map((skill) => (
              <SkillRing key={skill.id} label={skill.name} percent={skillPercent(skill.level)} accent={accent} />
            ))}
          </div>
        </section>
      </div>

      <aside className="flex w-[262px] shrink-0 flex-col gap-5 px-6 py-9" style={{ background: `linear-gradient(200deg, ${accent}2e, rgba(255,255,255,0.04) 62%)` }}>
        <Portrait model={model} className="h-[196px] w-full rounded-lg" />
        <div>
          <GaugeHeading title="About Me" accent={accent} icon={User} />
          <p className="text-[10.5px] leading-[1.75] text-white/70">{model.summary}</p>
        </div>
        {model.languages.length > 0 && (
          <div>
            <GaugeHeading title="Language" accent={accent} icon={LanguagesIcon} />
            <SkillBars skills={model.languages.map((l) => ({ id: l.id, name: l.name, level: 'expert' as const }))} accent={accent} />
          </div>
        )}
        {model.certifications.length > 0 && (
          <div>
            <GaugeHeading title="Certifications" accent={accent} icon={Award} />
            <div className="space-y-2.5 text-[10.5px] leading-relaxed">
              {model.certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold text-white/90">{c.name}</p>
                  <p className="text-white/50">{[c.issuer, c.date].filter(Boolean).join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {model.references.length > 0 && (
          <div>
            <GaugeHeading title="References" accent={accent} icon={Users} />
            <div className="space-y-2.5 text-[10.5px] leading-relaxed">
              {model.references.map((r) => (
                <div key={r.id}>
                  <p className="font-semibold text-white/90">{r.name}</p>
                  <p className="text-white/50">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-xl bg-black/35 px-4 py-3.5">
          <GaugeHeading title="Contact" accent={accent} icon={Phone} />
          <div className="space-y-2 text-[10.5px] text-white/75">
            {model.phone && <p>{model.phone}</p>}
            {model.email && <p className="break-all">{model.email}</p>}
            {model.location && <p>{model.location}</p>}
            {model.website && <p className="break-all">{model.website}</p>}
          </div>
        </div>
      </aside>
    </Page>
  )
}

function GaugeHeading({ title, accent, icon: Icon }: { title: string; accent: string; icon: typeof User }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em]">
      <Icon size={12} strokeWidth={2.4} style={{ color: accent }} />
      {title}
    </h2>
  )
}

/** A skill drawn as a ring. Stroke-dasharray on a 2*pi*r circumference. */
function SkillRing({ label, percent, accent }: { label: string; percent: number; accent: string }) {
  const R = 17
  const C = 2 * Math.PI * R
  return (
    <div className="flex w-[19%] flex-col items-center gap-1.5">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="4" />
        <circle
          cx="22" cy="22" r={R} fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${(C * percent) / 100} ${C}`} transform="rotate(-90 22 22)"
        />
        <text x="22" y="22" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="9.5" fontWeight="700">
          {percent}%
        </text>
      </svg>
      <p className="text-center text-[7.5px] font-semibold uppercase leading-tight tracking-wide text-white/65">{label}</p>
    </div>
  )
}

// Tagged — light and technical: skills as small tags grouped under their own
// sub-labels, dates as tinted pills, projects paired at the foot of the page.
function TaggedResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  // Four roughly even groups, so the rail reads as a categorised index rather
  // than one long undifferentiated list.
  const groups = ['Core', 'Tools', 'Platforms', 'Practice']
  const size = Math.ceil(model.skills.length / groups.length) || 1
  return (
    <Page className="px-10 py-9" style={{ color: INK }}>
      <header className="grid grid-cols-[1fr_1.25fr] items-start gap-8 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[31px] font-extrabold leading-none tracking-tight">{model.name}</h1>
          <p className="mt-2 text-[12px] font-semibold" style={{ color: accent }}>{model.title}</p>
        </div>
        <p className="pt-1 text-[9.5px] leading-[1.75] text-gray-600">{model.summary}</p>
      </header>

      <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-gray-200 py-2.5 text-[9.5px] text-gray-600">
        {model.email && <span className="flex items-center gap-1.5"><Mail size={10} style={{ color: accent }} />{model.email}</span>}
        {model.phone && <span className="flex items-center gap-1.5"><Phone size={10} style={{ color: accent }} />{model.phone}</span>}
        {model.location && <span className="flex items-center gap-1.5"><MapPin size={10} style={{ color: accent }} />{model.location}</span>}
        {model.website && <span className="flex items-center gap-1.5"><Globe size={10} style={{ color: accent }} />{model.website}</span>}
      </div>

      <div className="mt-6 grid grid-cols-[212px_1fr] gap-8">
        <SideColumn>
          <div>
            <TaggedHeading title="Skills" />
            <div className="space-y-2.5">
              {groups.map((g, gi) => {
                const slice = model.skills.slice(gi * size, (gi + 1) * size)
                if (!slice.length) return null
                return (
                  <div key={g}>
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-gray-400">{g}</p>
                    <div className="flex flex-wrap gap-1">
                      {slice.map((sk) => (
                        <span key={sk.id} className="rounded px-1.5 py-[2px] text-[9px] font-medium" style={{ backgroundColor: `${accent}14`, color: accent }}>
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <TaggedHeading title="Education" />
            <div className="space-y-2.5">
              {model.education.map((e) => (
                <div key={e.id} className="text-[10px] leading-relaxed">
                  <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                  <p className="text-gray-600">{e.school || 'University Name'}</p>
                  <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</p>
                </div>
              ))}
            </div>
          </div>
          {model.certifications.length > 0 && (
            <div>
              <TaggedHeading title="Certification" />
              <div className="space-y-2.5">
                {model.certifications.map((c) => (
                  <div key={c.id} className="text-[10px] leading-relaxed">
                    <p className="font-bold">{c.name}</p>
                    <p className="text-gray-500">{[c.issuer, c.date].filter(Boolean).join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {model.languages.length > 0 && (
            <div>
              <TaggedHeading title="Languages" />
              <div className="space-y-1 text-[10px]">
                {model.languages.map((l) => (
                  <p key={l.id}><span className="font-semibold">{l.name}</span> <span className="text-gray-500">({l.proficiency})</span></p>
                ))}
              </div>
            </div>
          )}
        </SideColumn>

        <div className="min-w-0">
          <TaggedHeading title="Work Experience" />
          <div className="space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11.5px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <span className="shrink-0 rounded px-2 py-[2px] text-[8.5px] font-bold" style={{ backgroundColor: `${accent}18`, color: accent }}>
                    {expDates(exp)}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px]" style={{ color: accent }}>{[exp.company, exp.location].filter(Boolean).join(', ')}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>

          {model.projects.length > 0 && (
            <>
              <TaggedHeading title="Featured Projects" className="mt-6" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {model.projects.map((pr) => (
                  <div key={pr.id}>
                    <p className="text-[10.5px] font-bold" style={{ color: accent }}>{pr.name}</p>
                    {pr.technologies.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {pr.technologies.map((t) => (
                          <span key={t} className="rounded px-1.5 py-[1px] text-[8px] font-medium text-gray-600" style={{ backgroundColor: '#f1f2f4' }}>{t}</span>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-[9px] leading-relaxed text-gray-600">{pr.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Page>
  )
}

function TaggedHeading({ title, className }: { title: string; className?: string }) {
  return (
    <h2 className={cn('mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500', className)}>{title}</h2>
  )
}

// ---------------------------------------------------------------------------
// Reference set, batch A
// ---------------------------------------------------------------------------

// Placard — filled heading bars notched out of a pale rail, tinted main column.
function PlacardResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <div className="flex w-[268px] shrink-0 flex-col overflow-hidden bg-[#faf7f2] pb-8">
        <div className="relative z-10 mt-9 px-6 py-5" style={{ backgroundColor: accent }}>
          <h1 className="text-[24px] font-extrabold uppercase leading-[0.98] tracking-wide text-white">{model.name}</h1>
          <p className="mt-1.5 text-[10px] text-white/80">{model.title}</p>
          <p className="mt-3 text-[9px] leading-[1.7] text-white/75">{truncate(model.summary, 190)}</p>
        </div>
        <div className="mt-6 space-y-5 px-6">
          <div>
            <PlacardBar title="Contact" accent={accent} />
            <div className="space-y-1.5 text-[10.5px] text-gray-700">
              {model.phone ? <p>{model.phone}</p> : null}
              {model.email ? <p className="break-all">{model.email}</p> : null}
              {model.location ? <p>{model.location}</p> : null}
              {model.website ? <p className="break-all">{model.website}</p> : null}
            </div>
          </div>
          <div>
            <PlacardBar title="Education" accent={accent} />
            <ul className="space-y-2.5 text-[10px]">
              {model.education.map((e) => (
                <li key={e.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  <span>
                    <span className="font-bold">{e.school || 'University'}</span>
                    <br />
                    <span className="text-gray-600">{[e.degree, e.endDate].filter(Boolean).join(', ')}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <PlacardBar title="Skills" accent={accent} />
            <ul className="space-y-2 text-[10.5px] text-gray-700">
              {model.skills.map((sk) => (
                <li key={sk.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {sk.name}
                </li>
              ))}
            </ul>
          </div>
          {model.languages.length > 0 ? (
            <div>
              <PlacardBar title="Languages" accent={accent} />
              <div className="space-y-1 text-[10px] text-gray-700">
                {model.languages.map((l) => (
                  <p key={l.id}>
                    {l.name} <span className="text-gray-500">({l.proficiency})</span>
                  </p>
                ))}
              </div>
            </div>
          ) : null}
          {model.references.length > 0 ? (
            <div>
              <PlacardBar title="References" accent={accent} />
              <div className="space-y-2 text-[10.5px] leading-relaxed">
                {model.references.map((r) => (
                  <div key={r.id}>
                    <p className="font-bold">{r.name}</p>
                    <p className="text-gray-600">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-w-0 flex-1 px-9 py-9 text-white" style={{ backgroundColor: secondary }}>
        <div className="mb-6">
          <Portrait model={model} className="h-[186px] w-full rounded-sm" />
        </div>
        <div className="space-y-5">
          <div>
            <PlacardHead title="Experience" icon={Briefcase} accent={accent} />
            <div className="space-y-3.5">
              {model.experience.map((exp) => (
                <div key={exp.id} className="flex gap-2.5">
                  <span className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[10.5px] font-bold text-white">{exp.title || exp.jobTitle || 'Job Title'}</p>
                      <p className="shrink-0 text-[8.5px]" style={{ color: accent }}>{expDates(exp)}</p>
                    </div>
                    <p className="text-[9px] text-white/50">{exp.company}</p>
                    <ul className="mt-1 space-y-[3px]">
                      {exp.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="text-[9px] leading-relaxed text-white/65">{line.replace(/^[-*]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {model.certifications.length > 0 ? (
            <div>
              <PlacardHead title="Certifications" icon={Award} accent={accent} />
              <div className="space-y-1.5 text-[9.5px]">
                {model.certifications.map((c) => (
                  <p key={c.id} className="text-white/75">
                    <span className="font-semibold text-white">{c.name}</span> - {[c.issuer, c.date].filter(Boolean).join(', ')}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

function PlacardBar({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2.5 -ml-6 inline-block px-6 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white" style={{ backgroundColor: accent }}>
      {title}
    </h2>
  )
}

function PlacardHead({ title, icon: Icon, accent }: { title: string; icon: typeof User; accent: string }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 border-b border-white/15 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
      <Icon size={12} strokeWidth={2.4} style={{ color: accent }} />
      {title}
    </h2>
  )
}

// Regent — dark rail beside a full-width masthead band that carries the name.
function RegentResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="flex w-[238px] shrink-0 flex-col gap-5 px-6 py-7 text-white" style={{ backgroundColor: secondary }}>
        <div className="flex justify-center">
          <Portrait model={model} className="h-[126px] w-[126px] rounded-full border-[3px] border-white/85" />
        </div>
        <div>
          <RegentHeading title="About Me" accent={accent} />
          <p className="text-[10px] leading-[1.75] text-white/70">{model.summary}</p>
        </div>
        <div>
          <RegentHeading title="Education" accent={accent} />
          <div className="space-y-2.5 text-[10px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-white/60">{e.school}</p>
                <p className="text-white/45">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <RegentHeading title="Skills" accent={accent} />
          <SkillBars skills={model.skills} accent={accent} />
        </div>
        {model.languages.length > 0 ? (
          <div>
            <RegentHeading title="Language" accent={accent} />
            <ul className="space-y-1 text-[10px] text-white/75">
              {model.languages.map((l) => (
                <li key={l.id} className="flex gap-2">
                  <span style={{ color: accent }}>&bull;</span>
                  {l.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="px-9 py-6" style={{ backgroundColor: accent }}>
          <h1 className="text-[28px] font-bold uppercase leading-none tracking-[0.06em] text-white">{model.name}</h1>
          <p className="mt-2 text-[11px] tracking-[0.2em] text-white/80">{model.title}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 px-9 py-4 text-[9.5px] text-gray-600">
          {model.phone ? <span className="flex items-center gap-1.5"><Phone size={10} style={{ color: accent }} />{model.phone}</span> : null}
          {model.email ? <span className="flex items-center gap-1.5"><Mail size={10} style={{ color: accent }} />{model.email}</span> : null}
          {model.website ? <span className="flex items-center gap-1.5"><Globe size={10} style={{ color: accent }} />{model.website}</span> : null}
          {model.location ? <span className="flex items-center gap-1.5"><MapPin size={10} style={{ color: accent }} />{model.location}</span> : null}
        </div>
        <div className="px-9 pb-8">
          <h2 className="mb-3 text-[12.5px] font-bold uppercase tracking-[0.2em]">Experience</h2>
          <TimelineRail items={model.experience} accent={accent} secondary={INK} />
          {model.references.length > 0 ? (
            <>
              <h2 className="mb-3 mt-6 text-[12.5px] font-bold uppercase tracking-[0.2em]">References</h2>
              <div className="grid grid-cols-2 gap-5">
                {model.references.map((r) => (
                  <div key={r.id} className="text-[9.5px] leading-relaxed">
                    <p className="text-[10.5px] font-bold">{r.name}</p>
                    <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(' / ')}</p>
                    {r.phone ? <p className="mt-1 text-gray-600"><span className="font-semibold">Phone:</span> {r.phone}</p> : null}
                    {r.email ? <p className="break-all text-gray-600"><span className="font-semibold">Email:</span> {r.email}</p> : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

function RegentHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em]">
      {title}
      <span className="mt-1.5 block h-px w-full" style={{ backgroundColor: `${accent}77` }} />
    </h2>
  )
}

// Signature — a script given name over a bold surname, framed portrait, blush rail.
function SignatureResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  const [given, ...rest] = model.name.split(' ')
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="flex w-[244px] shrink-0 flex-col gap-5 px-7 py-8" style={{ backgroundColor: `${accent}14` }}>
        <div className="border-[6px] border-white bg-white shadow-sm">
          <Portrait model={model} className="h-[178px] w-full" />
        </div>
        <div>
          <SignatureHeading title="About Me" accent={accent} />
          <p className="text-[10.5px] leading-[1.75] text-gray-600">{model.summary}</p>
        </div>
        <div>
          <SignatureHeading title="Contact" accent={accent} />
          <div className="space-y-2 text-[10.5px] text-gray-700">
            {model.phone ? <p>{model.phone}</p> : null}
            {model.email ? <p className="break-all">{model.email}</p> : null}
            {model.website ? <p className="break-all">{model.website}</p> : null}
            {model.location ? <p>{model.location}</p> : null}
          </div>
        </div>
        <div>
          <SignatureHeading title="Skills" accent={accent} />
          <ul className="space-y-2 text-[10.5px] text-gray-700">
            {model.skills.map((sk) => (
              <li key={sk.id} className="flex gap-2">
                <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                {sk.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SignatureHeading title="Education" accent={accent} />
          <div className="space-y-2.5 text-[10.5px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{e.school || 'University'}</p>
                <p className="text-gray-600">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        {model.languages.length > 0 ? (
          <div>
            <SignatureHeading title="Languages" accent={accent} />
            <ul className="space-y-1.5 text-[9.5px] text-gray-700">
              {model.languages.map((l) => (
                <li key={l.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {l.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 px-9 py-9">
        <header>
          <p className="text-[42px] italic leading-none" style={{ fontFamily: SERIF }}>{given}</p>
          <h1 className="mt-1 text-[27px] font-extrabold uppercase tracking-[0.12em]">{rest.join(' ')}</h1>
          <span className="mt-4 block h-px w-full bg-gray-200" />
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-500">{model.title}</p>
        </header>
        <div className="mt-7 space-y-5">
          <div>
            <SignatureBand title="Work Experience" accent={accent} />
            <div className="space-y-4">
              {model.experience.map((exp) => (
                <div key={exp.id}>
                  <p className="text-[11px] font-bold uppercase tracking-wide">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="text-[10px] font-semibold" style={{ color: accent }}>{exp.company}</p>
                  <p className="text-[9px] text-gray-400">{expDates(exp)}</p>
                  <BulletLines text={exp.description} accent={accent} />
                </div>
              ))}
            </div>
          </div>
          {model.certifications.length > 0 ? (
            <div>
              <SignatureBand title="Certifications" accent={accent} />
              <CertList items={model.certifications} />
            </div>
          ) : null}
          {model.references.length > 0 ? (
            <div>
              <SignatureBand title="References" accent={accent} />
              <div className="grid grid-cols-2 gap-5">
                {model.references.map((r) => (
                  <div key={r.id} className="text-[10px] leading-relaxed">
                    <p className="font-bold">{r.name}</p>
                    <p className="text-gray-600">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                    {r.phone ? <p className="text-gray-500">{r.phone}</p> : null}
                    {r.email ? <p className="break-all text-gray-500">{r.email}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

function SignatureHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2.5 bg-white px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>
      {title}
    </h2>
  )
}

function SignatureBand({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-3 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: `${accent}1c` }}>
      {title}
    </h2>
  )
}

// ---------------------------------------------------------------------------
// Reference set, batch B
// ---------------------------------------------------------------------------

// Corner — a tinted block pinned in the top corner, thin wide-tracked name.
function CornerResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="relative px-10 py-9" style={{ color: INK }}>
      <span aria-hidden className="absolute left-0 top-0 h-[54px] w-[156px]" style={{ backgroundColor: `${accent}30` }} />
      <header className="relative grid grid-cols-[152px_1fr] items-center gap-7">
        <div className="flex justify-center">
          <Portrait model={model} className="h-[132px] w-[132px] rounded-full border-4 border-white shadow" />
        </div>
        <div>
          <h1 className="text-[30px] font-light uppercase leading-none tracking-[0.2em]">{model.name}</h1>
          <p className="mt-2.5 text-[12px] font-light tracking-[0.1em] text-gray-500">{model.title}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[9px] text-gray-600">
            {model.phone ? <span className="flex items-center gap-1.5"><Phone size={9} style={{ color: accent }} />{model.phone}</span> : null}
            {model.email ? <span className="flex items-center gap-1.5"><Mail size={9} style={{ color: accent }} />{model.email}</span> : null}
            {model.website ? <span className="flex items-center gap-1.5"><Globe size={9} style={{ color: accent }} />{model.website}</span> : null}
          </div>
        </div>
      </header>

      <div className="mt-7 grid grid-cols-[214px_1fr] gap-8">
        <SideColumn>
          <div>
            <CornerHeading title="Summary" accent={accent} />
            <p className="text-[9.5px] leading-[1.75] text-gray-600">{model.summary}</p>
          </div>
          <div>
            <CornerHeading title="Education" accent={accent} />
            <div className="space-y-2.5 text-[10px] leading-relaxed">
              {model.education.map((e) => (
                <div key={e.id}>
                  <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                  <p className="text-gray-600">{e.school}</p>
                  <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <CornerHeading title="Skills" accent={accent} />
            <ul className="space-y-1.5 text-[10px] text-gray-700">
              {model.skills.map((sk) => (
                <li key={sk.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {sk.name}
                </li>
              ))}
            </ul>
          </div>
          {model.languages.length > 0 ? (
            <div>
              <CornerHeading title="Language" accent={accent} />
              <ul className="space-y-1.5 text-[10px] text-gray-700">
                {model.languages.map((l) => (
                  <li key={l.id} className="flex gap-2">
                    <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                    {l.name} <span className="text-gray-500">({l.proficiency})</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </SideColumn>

        <div className="min-w-0">
          <CornerHeading title="Experience" accent={accent} />
          <div className="space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="shrink-0 text-[9px] font-semibold" style={{ color: accent }}>{expDates(exp)}</p>
                </div>
                <p className="mt-0.5 text-[9.5px] text-gray-500">{[exp.company, exp.location].filter(Boolean).join(' | ')}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
          {model.references.length > 0 ? (
            <>
              <CornerHeading title="References" accent={accent} className="mt-6" />
              <div className="grid grid-cols-2 gap-5">
                {model.references.map((r) => (
                  <div key={r.id} className="text-[9.5px] leading-relaxed">
                    <p className="font-bold">{r.name}</p>
                    <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                    {r.phone ? <p className="text-gray-600">Phone: {r.phone}</p> : null}
                    {r.email ? <p className="break-all text-gray-600">Email: {r.email}</p> : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

function CornerHeading({ title, accent, className }: { title: string; accent: string; className?: string }) {
  return (
    <h2 className={cn('mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.16em]', className)}>
      {title}
      <span className="mt-1.5 block h-px w-full" style={{ backgroundColor: `${accent}4d` }} />
    </h2>
  )
}

// Dossier — deep rail, grouped skills, and a main column dense enough to carry
// projects as well as experience.
function DossierResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="flex w-[236px] shrink-0 flex-col gap-5 px-6 py-8 text-white" style={{ backgroundColor: secondary }}>
        <div className="flex justify-center">
          <Portrait model={model} className="h-[124px] w-[124px] rounded-full border-[3px] border-white/80" />
        </div>
        <div>
          <DossierHeading title="Contact" accent={accent} />
          <div className="space-y-1.5 text-[10px] leading-relaxed text-white/75">
            {model.location ? <p>{model.location}</p> : null}
            {model.phone ? <p>{model.phone}</p> : null}
            {model.email ? <p className="break-all">{model.email}</p> : null}
            {model.website ? <p className="break-all">{model.website}</p> : null}
          </div>
        </div>
        <div>
          <DossierHeading title="Education" accent={accent} />
          <div className="space-y-2.5 text-[10px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{e.school || 'University'}</p>
                <p className="text-white/65">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-white/45">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <DossierHeading title="Skills" accent={accent} />
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide" style={{ color: accent }}>Technical</p>
          <ul className="space-y-1 text-[10px] text-white/75">
            {model.skills.slice(0, Math.ceil(model.skills.length / 2)).map((sk) => (
              <li key={sk.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{sk.name}</li>
            ))}
          </ul>
          <p className="mb-1.5 mt-3 text-[9px] font-bold uppercase tracking-wide" style={{ color: accent }}>Tools</p>
          <ul className="space-y-1 text-[10px] text-white/75">
            {model.skills.slice(Math.ceil(model.skills.length / 2)).map((sk) => (
              <li key={sk.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{sk.name}</li>
            ))}
          </ul>
        </div>
        {model.languages.length > 0 ? (
          <div>
            <DossierHeading title="Languages" accent={accent} />
            <ul className="space-y-1 text-[10px] text-white/75">
              {model.languages.map((l) => (
                <li key={l.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{l.name} ({l.proficiency})</li>
              ))}
            </ul>
          </div>
        ) : null}
        {model.certifications.length > 0 ? (
          <div>
            <DossierHeading title="Certification" accent={accent} />
            <ul className="space-y-1 text-[10px] text-white/75">
              {model.certifications.map((c) => (
                <li key={c.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{c.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 px-8 py-8">
        <h1 className="text-[31px] font-bold leading-none tracking-tight" style={{ color: secondary }}>{model.name}</h1>
        <p className="mt-1.5 text-[13px] font-light text-gray-500">{model.title}</p>
        <p className="mt-3 text-[9.5px] leading-[1.7] text-gray-600">{model.summary}</p>
        <div className="mt-5 space-y-5">
          <div>
            <DossierMainHeading title="Work Experience" secondary={secondary} />
            <div className="space-y-3.5">
              {model.experience.map((exp) => (
                <div key={exp.id}>
                  <p className="text-[11px] font-bold">{[exp.title || exp.jobTitle || 'Job Title', exp.company].filter(Boolean).join(', ')}</p>
                  <p className="mt-0.5 text-[9px] text-gray-500">{expDates(exp)}</p>
                  <BulletLines text={exp.description} accent={accent} />
                </div>
              ))}
            </div>
          </div>
          {model.projects.length > 0 ? (
            <div>
              <DossierMainHeading title="Projects" secondary={secondary} />
              <div className="space-y-2.5">
                {model.projects.map((pr) => (
                  <div key={pr.id}>
                    <p className="text-[10.5px] font-bold">{pr.name}</p>
                    <p className="text-[9.5px] leading-relaxed text-gray-600">{pr.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {model.references.length > 0 ? (
            <div>
              <DossierMainHeading title="References" secondary={secondary} />
              <div className="grid grid-cols-2 gap-5">
                {model.references.map((r) => (
                  <div key={r.id} className="text-[9.5px] leading-relaxed">
                    <p className="font-bold">{r.name}</p>
                    <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                    {r.phone ? <p className="text-gray-600">Phone: {r.phone}</p> : null}
                    {r.email ? <p className="break-all text-gray-600">Email: {r.email}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

function DossierHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2 text-[12px] font-bold" style={{ color: accent }}>
      {title}
      <span className="mt-1 block h-px w-full bg-white/20" />
    </h2>
  )
}

function DossierMainHeading({ title, secondary }: { title: string; secondary: string }) {
  return (
    <h2 className="mb-2.5 text-[14px] font-bold" style={{ color: secondary }}>
      {title}
    </h2>
  )
}

// Pillar — the quiet detail collected into a rounded dark panel on the right,
// leaving the left free for one uninterrupted run of experience.
function PillarResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex gap-6 px-8 py-8" style={{ color: INK }}>
      <div className="flex min-w-0 flex-1 flex-col">
        <header>
          <h1 className="text-[30px] font-extrabold uppercase leading-none tracking-tight">{model.name}</h1>
          <p className="mt-2 text-[13px] uppercase tracking-[0.2em] text-gray-500">{model.title}</p>
        </header>
        <div className="mt-6">
          <PillarHeading title="Profile" />
          <p className="text-[9.5px] leading-[1.75] text-gray-600">{model.summary}</p>
        </div>
        <div className="mt-6 flex-1">
          <PillarHeading title="Work Experience" />
          <div className="relative space-y-4 pl-5">
            <span className="absolute left-[3px] top-2 bottom-2 w-px bg-gray-200" />
            {model.experience.map((exp) => (
              <div key={exp.id} className="relative">
                <span className="absolute -left-5 top-[5px] h-[7px] w-[7px] rounded-full" style={{ backgroundColor: secondary }} />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-bold">{exp.company || 'Company'}</p>
                  <p className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-gray-400">{expDates(exp)}</p>
                </div>
                <p className="text-[10px] font-semibold" style={{ color: accent }}>{exp.title || exp.jobTitle || 'Job Title'}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
        </div>
        {model.references.length > 0 ? (
          <div className="mt-6">
            <PillarHeading title="Reference" />
            <div className="grid grid-cols-2 gap-5">
              {model.references.map((r) => (
                <div key={r.id} className="text-[9.5px] leading-relaxed">
                  <p className="text-[10.5px] font-bold">{r.name}</p>
                  <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(' / ')}</p>
                  {r.phone ? <p className="text-gray-600">Phone: {r.phone}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="flex w-[232px] shrink-0 flex-col gap-5 rounded-3xl px-6 py-7 text-white" style={{ backgroundColor: secondary }}>
        <div className="rounded-2xl bg-white/10 p-2">
          <Portrait model={model} className="h-[150px] w-full rounded-xl" />
        </div>
        <div>
          <PillarPanelHeading title="Contact" accent={accent} />
          <div className="space-y-2.5 text-[11px] leading-relaxed text-white/75">
            {model.phone ? <p className="flex gap-2"><Phone size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.phone}</p> : null}
            {model.email ? <p className="flex gap-2"><Mail size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.email}</span></p> : null}
            {model.location ? <p className="flex gap-2"><MapPin size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.location}</p> : null}
            {model.website ? <p className="flex gap-2"><Globe size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.website}</span></p> : null}
          </div>
        </div>
        <div>
          <PillarPanelHeading title="Education" accent={accent} />
          <div className="space-y-3 text-[11px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-semibold" style={{ color: accent }}>{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
                <p className="font-bold uppercase">{e.school || 'University'}</p>
                <p className="text-white/60">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <PillarPanelHeading title="Skills" accent={accent} />
          <ul className="space-y-2 text-[11px] text-white/75">
            {model.skills.map((sk) => (
              <li key={sk.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{sk.name}</li>
            ))}
          </ul>
        </div>
        {model.certifications.length > 0 ? (
          <div>
            <PillarPanelHeading title="Certificates" accent={accent} />
            <div className="space-y-2.5 text-[11px] leading-relaxed">
              {model.certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-white/55">{[c.issuer, c.date].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {model.languages.length > 0 ? (
          <div>
            <PillarPanelHeading title="Languages" accent={accent} />
            <ul className="space-y-1.5 text-[10px] text-white/75">
              {model.languages.map((l) => (
                <li key={l.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{l.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>
    </Page>
  )
}

function PillarHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-2.5 text-[13px] font-extrabold uppercase tracking-[0.12em]">
      {title}
      <span className="mt-1.5 block h-[2px] w-full bg-gray-900" />
    </h2>
  )
}

function PillarPanelHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
      {title}
    </h2>
  )
}

// Bulletin — every section titled by a solid filled bar, on both sides.
function BulletinResume({ model }: { model: PreviewModel }) {
  // Deliberately one colour only: the bars, the icons and the masthead all use
  // `secondary`, which is what makes this layout read as a single block voice.
  const { secondary } = model.template
  return (
    <Page className="flex flex-col" style={{ color: INK }}>
      <div className="flex items-stretch">
        <div className="w-[236px] shrink-0 bg-[#eef1f5] px-6 pt-6">
          <Portrait model={model} className="h-[142px] w-full" />
        </div>
        <div className="flex flex-1 items-center px-8" style={{ backgroundColor: secondary }}>
          <div>
            <h1 className="text-[29px] font-bold leading-none text-white">{model.name}</h1>
            <p className="mt-2.5 text-[12px] uppercase tracking-[0.24em] text-white/75">{model.title}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-[236px] shrink-0 space-y-4 bg-[#eef1f5] px-6 py-6">
          <div className="space-y-2 text-[10px] text-gray-700">
            {model.phone ? <p className="flex gap-2"><Phone size={11} className="mt-[1px] shrink-0" style={{ color: secondary }} />{model.phone}</p> : null}
            {model.email ? <p className="flex gap-2"><Mail size={11} className="mt-[1px] shrink-0" style={{ color: secondary }} /><span className="break-all">{model.email}</span></p> : null}
            {model.location ? <p className="flex gap-2"><MapPin size={11} className="mt-[1px] shrink-0" style={{ color: secondary }} />{model.location}</p> : null}
          </div>
          <div>
            <BulletinBar title="More information" secondary={secondary} />
            <ul className="space-y-1 text-[10px] text-gray-700">
              {model.website ? <li>- {model.website}</li> : null}
              {model.linkedin ? <li>- {model.linkedin}</li> : null}
              <li>- Full availability</li>
            </ul>
          </div>
          {model.languages.length > 0 ? (
            <div>
              <BulletinBar title="Languages" secondary={secondary} />
              <div className="space-y-1.5 text-[10px]">
                {model.languages.map((l) => (
                  <div key={l.id}>
                    <p className="font-bold">{l.name}</p>
                    <p className="text-gray-600">{l.proficiency}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <BulletinBar title="Skills" secondary={secondary} />
            <ul className="space-y-1 text-[10px] text-gray-700">
              {model.skills.map((sk) => <li key={sk.id}>- {sk.name}</li>)}
            </ul>
          </div>
          {model.certifications.length > 0 ? (
            <div>
              <BulletinBar title="Certificates" secondary={secondary} />
              <ul className="space-y-1 text-[10px] text-gray-700">
                {model.certifications.map((c) => <li key={c.id}>- {c.name}</li>)}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-4 px-8 py-6">
          <div>
            <BulletinBar title="About me" secondary={secondary} />
            <p className="text-[9.5px] leading-[1.75] text-gray-600">{model.summary}</p>
          </div>
          <div>
            <BulletinBar title="Work experience" secondary={secondary} />
            <div className="space-y-3">
              {model.experience.map((exp) => (
                <div key={exp.id}>
                  <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="text-[9.5px] text-gray-500">{[exp.company, expDates(exp)].filter(Boolean).join(' | ')}</p>
                  <ul className="mt-1 space-y-[3px]">
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="text-[9px] leading-relaxed text-gray-600">- {line.replace(/^[-*]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <BulletinBar title="Academic data" secondary={secondary} />
            <div className="space-y-2">
              {model.education.map((e) => (
                <div key={e.id} className="text-[10px] leading-relaxed">
                  <p className="font-bold">{e.school || 'University'}</p>
                  <p className="text-gray-600">{[[e.degree, e.fieldOfStudy].filter(Boolean).join(' in '), [e.startDate, e.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

function BulletinBar({ title, secondary }: { title: string; secondary: string }) {
  return (
    <h2 className="mb-2 px-3 py-1.5 text-[11px] font-bold text-white" style={{ backgroundColor: secondary }}>
      {title}
    </h2>
  )
}

// ---------------------------------------------------------------------------
// Reference set, batch C
// ---------------------------------------------------------------------------

// Quill — warm rail with a framed portrait and a script hand beneath it.
function QuillResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="flex w-[240px] shrink-0 flex-col gap-5 px-7 py-8" style={{ backgroundColor: `${accent}12` }}>
        <div>
          <Portrait model={model} className="h-[186px] w-full" />
          <p className="mt-2 text-[17px] italic leading-none" style={{ fontFamily: SERIF, color: accent }}>{model.name}</p>
        </div>
        <div>
          <QuillHeading title="Contact" />
          <div className="space-y-2.5 text-[11px] leading-relaxed text-gray-700">
            {model.email ? <p className="flex gap-2"><Mail size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.email}</span></p> : null}
            {model.phone ? <p className="flex gap-2"><Phone size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.phone}</p> : null}
            {model.location ? <p className="flex gap-2"><MapPin size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.location}</p> : null}
            {model.website ? <p className="flex gap-2"><Globe size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.website}</span></p> : null}
          </div>
        </div>
        <div>
          <QuillHeading title="Expertise" />
          <ul className="space-y-2 text-[11px] text-gray-700">
            {model.skills.map((sk) => (
              <li key={sk.id} className="flex gap-2">
                <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                {sk.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <QuillHeading title="Education" />
          <div className="space-y-2.5 text-[11px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{e.school || 'University'}</p>
                <p className="text-gray-600">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        {model.languages.length > 0 ? (
          <div>
            <QuillHeading title="Languages" />
            <ul className="space-y-1.5 text-[10px] text-gray-700">
              {model.languages.map((l) => (
                <li key={l.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {l.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {model.references.length > 0 ? (
          <div>
            <QuillHeading title="References" />
            <div className="space-y-2.5 text-[10px] leading-relaxed">
              {model.references.map((r) => (
                <div key={r.id}>
                  <p className="font-bold">{r.name}</p>
                  <p className="text-gray-600">{[r.title, r.company].filter(Boolean).join(' | ')}</p>
                  {r.phone ? <p className="text-gray-500">{r.phone}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 px-9 py-9" style={{ backgroundColor: '#fdfcf9' }}>
        <header>
          <h1 className="text-[26px] font-extrabold uppercase leading-none tracking-[0.06em]">{model.name}</h1>
          <p className="mt-2 text-[13px] font-bold" style={{ color: accent }}>{model.title}</p>
        </header>
        <p className="mt-4 text-justify text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>
        <div className="mt-6">
          <QuillRule title="Work Experience" accent={accent} />
          <div className="relative space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id} className="relative pr-4">
                <span className="absolute right-0 top-[6px] h-[5px] w-[5px] rounded-full" style={{ backgroundColor: `${accent}99` }} />
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="shrink-0 pr-4 text-[9px] font-bold text-gray-400">{expDates(exp)}</p>
                </div>
                <p className="text-[9.5px] italic text-gray-500">{exp.company}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
        </div>
        {model.certifications.length > 0 ? (
          <div className="mt-6">
            <QuillRule title="Certifications" accent={accent} />
            <CertList items={model.certifications} />
          </div>
        ) : null}
      </div>
    </Page>
  )
}

function QuillHeading({ title }: { title: string }) {
  return <h2 className="mb-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em]">{title}</h2>
}

function QuillRule({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-3 text-center text-[13px] font-extrabold uppercase tracking-[0.14em]">
      {title}
      <span className="mx-auto mt-1.5 block h-px w-full" style={{ backgroundColor: `${accent}55` }} />
    </h2>
  )
}

// Rosette — soft tinted headings and a rounded portrait, lighter in weight
// than Quill even though both run a rail and a column.
function RosetteResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="px-9 py-8" style={{ color: INK }}>
      <header className="grid grid-cols-[168px_1fr] items-start gap-7">
        <Portrait model={model} className="h-[168px] w-full rounded-2xl" />
        <div>
          <h1 className="text-[27px] font-extrabold uppercase leading-none tracking-[0.04em]" style={{ color: accent }}>{model.name}</h1>
          <p className="mt-2 text-[13px] font-extrabold">{model.title}</p>
          <p className="mt-3 text-[9px] leading-[1.75] text-gray-600">{model.summary}</p>
        </div>
      </header>
      <span className="mt-5 block h-[3px] w-full rounded-full" style={{ backgroundColor: `${accent}55` }} />

      <div className="mt-6 grid grid-cols-[208px_1fr] gap-8">
        <SideColumn>
          <div>
            <RosetteHeading title="Contact" accent={accent} />
            <div className="space-y-2 text-[10px] leading-relaxed text-gray-700">
              {model.email ? <p className="break-all">{model.email}</p> : null}
              {model.phone ? <p>{model.phone}</p> : null}
              {model.location ? <p>{model.location}</p> : null}
              {model.website ? <p className="break-all">{model.website}</p> : null}
            </div>
          </div>
          <div>
            <RosetteHeading title="Expertise" accent={accent} />
            <ul className="space-y-1.5 text-[10px] text-gray-700">
              {model.skills.map((sk) => (
                <li key={sk.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {sk.name}
                </li>
              ))}
            </ul>
          </div>
          {model.languages.length > 0 ? (
            <div>
              <RosetteHeading title="Languages" accent={accent} />
              <ul className="space-y-1.5 text-[10px] text-gray-700">
                {model.languages.map((l) => (
                  <li key={l.id} className="flex gap-2">
                    <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                    {l.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {model.references.length > 0 ? (
            <div>
              <RosetteHeading title="References" accent={accent} />
              <div className="space-y-2.5 text-[10px] leading-relaxed">
                {model.references.map((r) => (
                  <div key={r.id}>
                    <p className="font-bold">{r.name}</p>
                    <p className="text-gray-600">{[r.title, r.company].filter(Boolean).join(' | ')}</p>
                    {r.phone ? <p className="text-gray-500">{r.phone}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </SideColumn>

        <div className="min-w-0">
          <RosetteHeading title="Work Experience" accent={accent} />
          <div className="space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id} className="relative pr-4">
                <span className="absolute right-0 top-[6px] h-[6px] w-[6px] rounded-full" style={{ backgroundColor: `${accent}77` }} />
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="shrink-0 pr-4 text-[9px] font-bold text-gray-400">{expDates(exp)}</p>
                </div>
                <p className="text-[9.5px]" style={{ color: accent }}>{exp.company}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
          <RosetteHeading title="Education" accent={accent} className="mt-6" />
          <div className="space-y-2.5">
            {model.education.map((e) => (
              <div key={e.id} className="text-[10px] leading-relaxed">
                <p className="font-extrabold uppercase">{e.school || 'University'}</p>
                <p className="text-gray-600">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}

function RosetteHeading({ title, accent, className }: { title: string; accent: string; className?: string }) {
  return (
    <h2 className={cn('mb-2.5 text-[12px] font-extrabold uppercase tracking-[0.16em]', className)} style={{ color: accent }}>
      {title}
    </h2>
  )
}

// Bloom — rounded shapes throughout: an oval portrait, lozenge headings and
// outlined contact pills.
function BloomResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex gap-5 px-6 py-6" style={{ backgroundColor: '#faf6f2', color: INK }}>
      <div className="flex w-[238px] shrink-0 flex-col gap-4">
        <div className="overflow-hidden rounded-[999px] border-[5px]" style={{ borderColor: secondary }}>
          <Portrait model={model} className="h-[214px] w-full" />
        </div>
        <div className="space-y-2">
          {model.email ? <BloomPill text={model.email} secondary={secondary} /> : null}
          {model.website ? <BloomPill text={model.website} secondary={secondary} /> : null}
          {model.phone ? <BloomPill text={model.phone} secondary={secondary} /> : null}
        </div>
        <div className="rounded-2xl px-5 py-4 text-white" style={{ backgroundColor: secondary }}>
          <BloomHeading title="Achievements" accent={accent} />
          <div className="space-y-2 text-[9.5px] leading-relaxed">
            {model.certifications.map((c) => (
              <div key={c.id}>
                <p className="font-bold">{c.name}</p>
                <p className="text-white/60">{[c.issuer, c.date].filter(Boolean).join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl px-5 py-4 text-white" style={{ backgroundColor: secondary }}>
          <BloomHeading title="Education" accent={accent} />
          <div className="space-y-2 text-[9.5px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{e.school || 'University'}</p>
                <p className="text-white/60">{[e.degree, [e.startDate, e.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-2xl px-5 py-4 text-white" style={{ backgroundColor: secondary }}>
          <BloomHeading title="Personal Skill" accent={accent} />
          <ul className="space-y-1.5 text-[9.5px] text-white/80">
            {model.skills.map((sk) => (
              <li key={sk.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{sk.name}</li>
            ))}
          </ul>
          {model.languages.length > 0 ? (
            <>
              <BloomHeading title="Language" accent={accent} className="mt-3" />
              <ul className="space-y-1.5 text-[9.5px] text-white/80">
                {model.languages.map((l) => (
                  <li key={l.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{l.name}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="rounded-2xl px-6 py-5 text-white" style={{ backgroundColor: secondary }}>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">{model.title}</p>
          <h1 className="mt-1.5 text-[27px] font-extrabold uppercase leading-none tracking-wide">{model.name}</h1>
          <p className="mt-2.5 text-[9px] leading-[1.7] text-white/70">{truncate(model.summary, 210)}</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white px-6 py-5">
          <BloomLozenge title="Work Experience" secondary={secondary} />
          <div className="space-y-3.5">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-bold">{[exp.title || exp.jobTitle || 'Job Title', exp.company].filter(Boolean).join(' - ')}</p>
                  <p className="shrink-0 text-[8.5px] text-gray-400">{expDates(exp)}</p>
                </div>
                <ul className="mt-1 space-y-[3px]">
                  {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="flex gap-2 text-[9px] leading-relaxed text-gray-600">
                      <span style={{ color: accent }}>&bull;</span>
                      {line.replace(/^[-*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <BloomLozenge title="Education" secondary={secondary} className="mt-5" />
          <div className="space-y-2">
            {model.education.map((e) => (
              <div key={e.id} className="flex gap-2 text-[10px] leading-relaxed">
                <span className="mt-[6px] h-[4px] w-[4px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                <span>
                  <span className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</span>
                  <br />
                  <span className="text-gray-600">{[e.school, [e.startDate, e.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' - ')}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}

function BloomPill({ text, secondary }: { text: string; secondary: string }) {
  return (
    <p className="truncate rounded-full border px-4 py-1.5 text-center text-[9px]" style={{ borderColor: secondary, color: secondary }}>
      {text}
    </p>
  )
}

function BloomHeading({ title, accent, className }: { title: string; accent: string; className?: string }) {
  return (
    <h2 className={cn('mb-2 text-[11px] font-bold', className)} style={{ color: accent, fontFamily: SERIF }}>
      {title}
    </h2>
  )
}

function BloomLozenge({ title, secondary, className }: { title: string; secondary: string; className?: string }) {
  return (
    <h2 className={cn('mb-3 inline-block rounded-full px-5 py-1.5 text-[11px] font-bold text-white', className)} style={{ backgroundColor: secondary, fontFamily: SERIF }}>
      {title}
    </h2>
  )
}

// Column — rail headings centred rather than ranged left, which reads as a
// spine down the page rather than a list.
function ColumnResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="flex w-[232px] shrink-0 flex-col gap-5 px-6 py-8 text-center text-white" style={{ backgroundColor: secondary }}>
        <div className="flex justify-center">
          <Portrait model={model} className="h-[132px] w-[132px] rounded-full border-[3px] border-white/85" />
        </div>
        <div>
          <ColumnHeading title="Contact" accent={accent} />
          <div className="space-y-2.5 text-[10.5px] leading-relaxed text-white/75">
            {model.phone ? <p>{model.phone}</p> : null}
            {model.email ? <p className="break-all">{model.email}</p> : null}
            {model.website ? <p className="break-all">{model.website}</p> : null}
            {model.location ? <p>{model.location}</p> : null}
          </div>
        </div>
        <div>
          <ColumnHeading title="Education" accent={accent} />
          <div className="space-y-3 text-[10.5px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-white/65">{e.school}</p>
                <p className="text-white/45">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <ColumnHeading title="Skills" accent={accent} />
          <ul className="space-y-2 text-[10.5px] text-white/75">
            {model.skills.map((sk) => <li key={sk.id}>{sk.name}</li>)}
          </ul>
        </div>
        {model.languages.length > 0 ? (
          <div>
            <ColumnHeading title="Language" accent={accent} />
            <ul className="space-y-1.5 text-[10px] text-white/75">
              {model.languages.map((l) => <li key={l.id}>{l.name}</li>)}
            </ul>
          </div>
        ) : null}
        {model.references.length > 0 ? (
          <div>
            <ColumnHeading title="References" accent={accent} />
            <div className="space-y-2.5 text-[10.5px] leading-relaxed text-white/75">
              {model.references.map((r) => (
                <div key={r.id}>
                  <p className="font-bold text-white">{r.name}</p>
                  <p>{[r.title, r.company].filter(Boolean).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {model.certifications.length > 0 ? (
          <div>
            <ColumnHeading title="Certificates" accent={accent} />
            <ul className="space-y-1.5 text-[10px] text-white/75">
              {model.certifications.map((c) => <li key={c.id}>{c.name}</li>)}
            </ul>
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 px-9 py-9">
        <h1 className="text-[33px] font-extrabold uppercase leading-[1.02] tracking-tight">{model.name}</h1>
        <p className="mt-2.5 text-[13px] uppercase tracking-[0.3em] text-gray-500">{model.title}</p>
        <div className="mt-7">
          <ColumnMainHeading title="About me" />
          <p className="text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>
        </div>
        <div className="mt-6">
          <ColumnMainHeading title="Experience" />
          <div className="space-y-3.5">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="shrink-0 text-[9px] text-gray-400">{expDates(exp)}</p>
                </div>
                <p className="text-[9.5px] text-gray-500">{exp.company}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
        </div>
        {model.references.length > 0 ? (
          <div className="mt-6">
            <ColumnMainHeading title="Reference" />
            <div className="grid grid-cols-2 gap-5">
              {model.references.map((r) => (
                <div key={r.id} className="text-[9.5px] leading-relaxed">
                  <p className="font-bold">{[r.name, r.title].filter(Boolean).join(' | ')}</p>
                  <p className="text-gray-500">{r.company}</p>
                  {r.phone ? <p className="text-gray-600">{r.phone}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  )
}

function ColumnHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
      {title}
    </h2>
  )
}

function ColumnMainHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-2.5 text-[15px] font-extrabold">
      {title}
      <span className="mt-1.5 block h-px w-full bg-gray-300" />
    </h2>
  )
}

// Alcove — rounded grey rail with the name set beneath the portrait rather
// than beside it.
function AlcoveResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex gap-7 px-7 py-7" style={{ color: INK }}>
      <aside className="flex w-[228px] shrink-0 flex-col gap-5 rounded-[26px] bg-[#f0eeec] px-6 py-7">
        <Portrait model={model} className="h-[174px] w-full rounded-[18px]" />
        <div>
          <p className="text-[13px] tracking-[0.24em] text-gray-500">{model.name.split(' ')[0]}</p>
          <p className="text-[21px] font-extrabold uppercase leading-none tracking-wide">{model.name.split(' ').slice(1).join(' ')}</p>
          <p className="mt-1.5 text-[10px] text-gray-500">{model.title}</p>
        </div>
        <div className="space-y-1.5 text-[10px] text-gray-700">
          {model.phone ? <p className="flex gap-2"><Phone size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.phone}</p> : null}
          {model.email ? <p className="flex gap-2"><Mail size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.email}</span></p> : null}
        </div>
        <div>
          <AlcoveHeading title="Education" />
          <div className="space-y-3 text-[10.5px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-semibold">{e.school || 'University'}</p>
                <p className="text-gray-600">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <AlcoveHeading title="Skills" />
          <ul className="space-y-2 text-[10.5px] text-gray-700">
            {model.skills.map((sk) => (
              <li key={sk.id} className="flex gap-2">
                <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                {sk.name}
              </li>
            ))}
          </ul>
        </div>
        {model.certifications.length > 0 ? (
          <div>
            <AlcoveHeading title="Certificates" />
            <div className="space-y-2.5 text-[10.5px] leading-relaxed">
              {model.certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-gray-500">{[c.issuer, c.date].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {model.languages.length > 0 ? (
          <div>
            <AlcoveHeading title="Language" />
            <ul className="space-y-1.5 text-[10px] text-gray-700">
              {model.languages.map((l) => (
                <li key={l.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {l.name} <span className="text-gray-500">({l.proficiency})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 py-2">
        <AlcoveMainHeading title="Summary" />
        <p className="text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>
        <AlcoveMainHeading title="Work Experience" className="mt-6" />
        <div className="space-y-4">
          {model.experience.map((exp) => (
            <div key={exp.id}>
              <p className="text-[9.5px] text-gray-400">({expDates(exp)})</p>
              <p className="text-[11px] font-bold">{[exp.title || exp.jobTitle || 'Job Title', exp.company].filter(Boolean).join(' | ')}</p>
              <BulletLines text={exp.description} accent={accent} />
            </div>
          ))}
        </div>
        {model.references.length > 0 ? (
          <>
            <AlcoveMainHeading title="References" className="mt-6" />
            <div className="grid grid-cols-2 gap-5">
              {model.references.map((r) => (
                <div key={r.id} className="text-[9.5px] leading-relaxed">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                  {r.phone ? <p className="text-gray-600">Phone: {r.phone}</p> : null}
                  {r.email ? <p className="break-all text-gray-600">Email: {r.email}</p> : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </Page>
  )
}

function AlcoveHeading({ title }: { title: string }) {
  return <h2 className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.1em]">{title}</h2>
}

function AlcoveMainHeading({ title, className }: { title: string; className?: string }) {
  return <h2 className={cn('mb-2.5 text-[13px] font-bold uppercase tracking-[0.1em]', className)}>{title}</h2>
}

// ---------------------------------------------------------------------------
// Reference set, batch D
// ---------------------------------------------------------------------------

// Tablet — grey rail, and dates carried as tinted pills ahead of each role.
function TabletResume({ model }: { model: PreviewModel }) {
  const { accent } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="flex w-[238px] shrink-0 flex-col gap-5 bg-[#eceae8] px-6 py-8">
        <div className="flex justify-center">
          <Portrait model={model} className="h-[128px] w-[128px] rounded-full border-[3px] border-white" />
        </div>
        <div>
          <TabletHeading title="Contact" />
          <div className="space-y-1.5 text-[10px] leading-relaxed text-gray-700">
            {model.phone ? <p><span className="font-semibold">Phone:</span> {model.phone}</p> : null}
            {model.email ? <p className="break-all"><span className="font-semibold">E-Mail:</span> {model.email}</p> : null}
            {model.location ? <p><span className="font-semibold">Address:</span> {model.location}</p> : null}
          </div>
        </div>
        <div>
          <TabletHeading title="Education" />
          <div className="space-y-2.5 text-[10px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-gray-600">{e.school}</p>
                <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <TabletHeading title="Skills" />
          <SkillBars skills={model.skills} accent={accent} track="#d6d3d0" labelClass="text-gray-800" />
        </div>
        {model.languages.length > 0 ? (
          <div>
            <TabletHeading title="Language" />
            <ul className="space-y-1.5 text-[10px] text-gray-700">
              {model.languages.map((l) => (
                <li key={l.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {l.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {model.certifications.length > 0 ? (
          <div>
            <TabletHeading title="Certificates" />
            <div className="space-y-2 text-[10px] leading-relaxed">
              {model.certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-gray-500">{[c.issuer, c.date].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 px-9 py-8">
        <h1 className="text-[31px] font-bold leading-none tracking-tight">{model.name}</h1>
        <p className="mt-2 text-[14px] font-light text-gray-500">{model.title}</p>
        <div className="mt-6">
          <TabletMainHeading title="About Me" />
          <p className="text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>
        </div>
        <div className="mt-6">
          <TabletMainHeading title="Experience" />
          <div className="space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <span className="inline-block rounded px-2 py-[2px] text-[8.5px] font-semibold" style={{ backgroundColor: `${accent}1c`, color: accent }}>
                  {expDates(exp)}
                </span>
                <p className="mt-1.5 text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                <p className="text-[9.5px] text-gray-500">{[exp.company, exp.location].filter(Boolean).join(' | ')}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
        </div>
        {model.references.length > 0 ? (
          <div className="mt-6">
            <TabletMainHeading title="References" />
            <div className="grid grid-cols-2 gap-5">
              {model.references.map((r) => (
                <div key={r.id} className="text-[9.5px] leading-relaxed">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(' / ')}</p>
                  {r.phone ? <p className="text-gray-600">Phone: {r.phone}</p> : null}
                  {r.email ? <p className="break-all text-gray-600">Email: {r.email}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  )
}

function TabletHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-2.5 text-[12px] font-bold">
      {title}
      <span className="mt-1.5 block h-px w-full bg-gray-300" />
    </h2>
  )
}

function TabletMainHeading({ title }: { title: string }) {
  return <h2 className="mb-2.5 text-[14px] font-bold">{title}</h2>
}

// Gutter — years live in their own fixed channel to the left of every role,
// so the dates line up down the page instead of trailing each heading.
function GutterResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <aside className="flex w-[240px] shrink-0 flex-col gap-5 px-6 py-8 text-white" style={{ backgroundColor: secondary }}>
        <div className="flex justify-center">
          <Portrait model={model} className="h-[136px] w-[136px] rounded-full border-[4px] border-white/25" />
        </div>
        <div>
          <GutterRailHeading title="Contact" />
          <div className="space-y-2.5 text-[11px] leading-relaxed text-white/75">
            {model.phone ? <p className="flex gap-2"><Phone size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.phone}</p> : null}
            {model.email ? <p className="flex gap-2"><Mail size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.email}</span></p> : null}
            {model.location ? <p className="flex gap-2"><MapPin size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.location}</p> : null}
          </div>
        </div>
        <div>
          <GutterRailHeading title="Education" />
          <div className="space-y-3 text-[11px] leading-relaxed">
            {model.education.map((e) => (
              <div key={e.id}>
                <p className="font-bold">{e.school || 'University'}</p>
                <p className="text-white/65">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-white/45">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <GutterRailHeading title="Skills" />
          <ul className="space-y-2 text-[11px] text-white/75">
            {model.skills.map((sk) => (
              <li key={sk.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{sk.name}</li>
            ))}
          </ul>
        </div>
        {model.certifications.length > 0 ? (
          <div>
            <GutterRailHeading title="Certifications" />
            <div className="space-y-2.5 text-[10.5px] leading-relaxed">
              {model.certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-white/55">{[c.issuer, c.date].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {model.languages.length > 0 ? (
          <div>
            <GutterRailHeading title="Languages" />
            <SkillBars skills={model.languages.map((l) => ({ id: l.id, name: l.name, level: 'expert' as const }))} accent={accent} />
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1 px-9 py-8">
        <h1 className="text-[33px] font-extrabold uppercase leading-[1.02] tracking-tight">{model.name}</h1>
        <p className="mt-2 border-b border-gray-200 pb-3 text-[13px] font-light tracking-[0.06em] text-gray-500">{model.title}</p>
        <div className="mt-6">
          <GutterHead title="Profile" icon={User} accent={accent} />
          <p className="text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>
        </div>
        <div className="mt-6">
          <GutterHead title="Experience" icon={Briefcase} accent={accent} />
          <div className="space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[62px_1fr] gap-4">
                <p className="pt-[2px] text-[9px] font-bold leading-snug" style={{ color: accent }}>
                  {expDates(exp).split(' — ').map((part, i) => (
                    <span key={i} className="block">{part}</span>
                  ))}
                </p>
                <div className="border-l border-gray-200 pl-4">
                  <p className="text-[11px] font-bold">{exp.company || 'Company'}</p>
                  <p className="text-[9.5px] text-gray-500">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <BulletLines text={exp.description} accent={accent} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {model.references.length > 0 ? (
          <div className="mt-6">
            <GutterHead title="References" icon={Users} accent={accent} />
            <div className="grid grid-cols-2 gap-5">
              {model.references.map((r) => (
                <div key={r.id} className="text-[9.5px] leading-relaxed">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(' / ')}</p>
                  {r.email ? <p className="break-all text-gray-600">{r.email}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  )
}

function GutterRailHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.18em]">
      {title}
      <span className="mt-1.5 block h-px w-full bg-white/25" />
    </h2>
  )
}

function GutterHead({ title, icon: Icon, accent }: { title: string; icon: typeof User; accent: string }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em]">
      <Icon size={13} strokeWidth={2.4} style={{ color: accent }} />
      {title}
    </h2>
  )
}

// Billboard — the portrait runs the full height of the page down the left edge
// with the contact details sitting over its foot.
function BillboardResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <div className="relative w-[272px] shrink-0">
        <Portrait model={model} className="h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 pt-16" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0))' }}>
          <div className="space-y-2 text-[9.5px] leading-snug text-white/85">
            {model.phone ? (
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Phone</p>
                <p>{model.phone}</p>
              </div>
            ) : null}
            {model.location ? (
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Address</p>
                <p>{model.location}</p>
              </div>
            ) : null}
            {model.email ? (
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Email</p>
                <p className="break-all">{model.email}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 px-8 py-8" style={{ backgroundColor: '#f2f1ef' }}>
        <h1 className="text-[46px] font-extrabold uppercase leading-[0.86] tracking-tight" style={{ color: secondary }}>
          {model.name.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}
        </h1>
        <p className="mt-3 text-[15px] italic text-gray-500" style={{ fontFamily: SERIF }}>{model.title}</p>
        <div className="mt-6">
          <BillboardHeading title="Summary" />
          <p className="text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>
        </div>
        <div className="mt-5">
          <BillboardHeading title="Work Experience" />
          <div className="space-y-3">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-bold">{exp.company || 'Company'}</p>
                  <p className="shrink-0 text-[9px] text-gray-400">{expDates(exp)}</p>
                </div>
                <p className="text-[9.5px] italic text-gray-500">{exp.title || exp.jobTitle || 'Job Title'}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <BillboardHeading title="Education" />
          <div className="space-y-2">
            {model.education.map((e) => (
              <div key={e.id} className="text-[10px] leading-relaxed">
                <p className="font-bold">{e.school || 'University'}</p>
                <p className="italic text-gray-600">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
              </div>
            ))}
          </div>
        </div>
        {model.certifications.length > 0 ? (
          <div className="mt-5">
            <BillboardHeading title="Certifications" />
            <div className="space-y-1.5 text-[10px] leading-relaxed">
              {model.certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-gray-500">{[c.issuer, c.date].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-5">
          <BillboardHeading title="Skills" />
          <ul className="grid grid-cols-2 gap-x-5 gap-y-1 text-[10px] text-gray-700">
            {model.skills.map((sk) => (
              <li key={sk.id} className="flex gap-2">
                <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                {sk.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Page>
  )
}

function BillboardHeading({ title }: { title: string }) {
  return <h2 className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.14em]">{title}</h2>
}

// Verdant — deep single-colour page, each role introduced by its own icon disc.
function VerdantResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-9 py-8 text-white" style={{ backgroundColor: secondary }}>
      <header className="grid grid-cols-[1fr_170px] items-start gap-7">
        <div>
          <h1 className="text-[31px] font-bold leading-none tracking-tight">{model.name}</h1>
          <p className="mt-2 text-[12px] font-semibold" style={{ color: accent }}>{model.title}</p>
          <p className="mt-3 text-[9.5px] leading-[1.75] text-white/70">{model.summary}</p>
        </div>
        <Portrait model={model} className="h-[152px] w-full rounded-xl" />
      </header>

      <div className="mt-7 grid grid-cols-[1fr_224px] gap-8">
        <div className="min-w-0">
          <VerdantHeading title="Work Experience" accent={accent} />
          <div className="space-y-3.5">
            {model.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[30px_1fr] gap-3">
                <span className="mt-[2px] flex h-[26px] w-[26px] items-center justify-center rounded-full" style={{ backgroundColor: `${accent}26` }}>
                  <Briefcase size={12} strokeWidth={2.4} style={{ color: accent }} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="text-[9px] font-semibold" style={{ color: accent }}>{expDates(exp)}</p>
                  <p className="mt-1 text-[9px] leading-relaxed text-white/65">
                    {exp.description.split('\n').filter(Boolean).map((l) => l.replace(/^[-*]\s*/, '')).join(' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SideColumn>
          <div>
            <VerdantHeading title="Education" accent={accent} />
            <ul className="space-y-2 text-[10px] leading-relaxed">
              {model.education.map((e) => (
                <li key={e.id} className="flex gap-2">
                  <span className="mt-[6px] h-[4px] w-[4px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  <span>
                    <span className="font-semibold">{e.school || 'University'}</span>
                    <br />
                    <span className="text-white/55">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <VerdantHeading title="Skills" accent={accent} />
            <SkillBars skills={model.skills} accent={accent} />
          </div>
          {model.languages.length > 0 ? (
            <div>
              <VerdantHeading title="Languages" accent={accent} />
              <ul className="space-y-1.5 text-[10px] text-white/75">
                {model.languages.map((l) => (
                  <li key={l.id} className="flex gap-2"><span style={{ color: accent }}>&bull;</span>{l.name}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div>
            <VerdantHeading title="Contact Info" accent={accent} />
            <div className="space-y-2 text-[10px] leading-relaxed text-white/75">
              {model.phone ? <p className="flex gap-2"><Phone size={10} className="mt-[2px] shrink-0" style={{ color: accent }} />{model.phone}</p> : null}
              {model.email ? <p className="flex gap-2"><Mail size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.email}</span></p> : null}
              {model.website ? <p className="flex gap-2"><Globe size={10} className="mt-[2px] shrink-0" style={{ color: accent }} /><span className="break-all">{model.website}</span></p> : null}
            </div>
          </div>
        </SideColumn>
      </div>
    </Page>
  )
}

function VerdantHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2.5 text-[12.5px] font-bold">
      {title}
      <span className="mt-1.5 block h-px w-full" style={{ backgroundColor: `${accent}55` }} />
    </h2>
  )
}

// ---------------------------------------------------------------------------
// Reference set, batch E
// ---------------------------------------------------------------------------

// Envoy — centred masthead over a true three-column body. The only layout in
// the catalogue that splits the page three ways.
function EnvoyResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-9 py-8" style={{ color: INK }}>
      <header className="border-y-[3px] py-5 text-center" style={{ borderColor: secondary }}>
        <h1 className="text-[32px] font-extrabold uppercase leading-none tracking-[0.14em]">{model.name}</h1>
        <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.34em]" style={{ color: accent }}>{model.title}</p>
      </header>

      <p className="mt-5 text-justify text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>

      <div className="mt-6 grid grid-cols-[176px_1fr_186px] gap-7">
        <SideColumn>
          <div>
            <EnvoyHeading title="Contact" accent={accent} />
            <div className="space-y-2 text-[9.5px] leading-relaxed text-gray-700">
              {model.phone ? <p>{model.phone}</p> : null}
              {model.email ? <p className="break-all">{model.email}</p> : null}
              {model.location ? <p>{model.location}</p> : null}
              {model.website ? <p className="break-all">{model.website}</p> : null}
              {model.linkedin ? <p className="break-all">{model.linkedin}</p> : null}
            </div>
          </div>
          <div>
            <EnvoyHeading title="Education" accent={accent} />
            <div className="space-y-2.5 text-[9.5px] leading-relaxed">
              {model.education.map((e) => (
                <div key={e.id}>
                  <p className="font-bold">{e.school || 'University'}</p>
                  <p className="text-gray-600">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                  <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </div>
          {model.languages.length > 0 ? (
            <div>
              <EnvoyHeading title="Languages" accent={accent} />
              <ul className="space-y-1.5 text-[9.5px] text-gray-700">
                {model.languages.map((l) => (
                  <li key={l.id}>{l.name} <span className="text-gray-500">({l.proficiency})</span></li>
                ))}
              </ul>
            </div>
          ) : null}
        </SideColumn>

        <div className="min-w-0 border-x border-gray-200 px-7">
          <EnvoyHeading title="Experience" accent={accent} />
          <div className="space-y-4">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                <p className="text-[9.5px] italic text-gray-500">{[exp.company, expDates(exp)].filter(Boolean).join(' | ')}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
        </div>

        <SideColumn>
          <div>
            <EnvoyHeading title="Skills" accent={accent} />
            <ul className="space-y-1.5 text-[9.5px] text-gray-700">
              {model.skills.map((sk) => (
                <li key={sk.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {sk.name}
                </li>
              ))}
            </ul>
          </div>
          {model.certifications.length > 0 ? (
            <div>
              <EnvoyHeading title="Certifications" accent={accent} />
              <div className="space-y-2 text-[9.5px] leading-relaxed">
                {model.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-gray-500">{[c.issuer, c.date].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {model.references.length > 0 ? (
            <div>
              <EnvoyHeading title="References" accent={accent} />
              <div className="space-y-2 text-[9.5px] leading-relaxed">
                {model.references.map((r) => (
                  <div key={r.id}>
                    <p className="font-bold">{r.name}</p>
                    <p className="text-gray-500">{[r.title, r.company].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </SideColumn>
      </div>
    </Page>
  )
}

function EnvoyHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.22em]">
      {title}
      <span className="mt-1.5 block h-px w-8" style={{ backgroundColor: accent }} />
    </h2>
  )
}

// Ribbon — sections numbered down a tinted band, so the page reads in order.
function RibbonResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="flex" style={{ color: INK }}>
      <span aria-hidden className="w-[34px] shrink-0" style={{ backgroundColor: secondary }} />
      <div className="min-w-0 flex-1 px-8 py-8">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[32px] font-extrabold leading-none tracking-tight">{model.name}</h1>
            <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>{model.title}</p>
            <div className="mt-3 space-y-0.5 text-[9.5px] text-gray-600">
              {model.phone ? <p>{model.phone}</p> : null}
              {model.email ? <p className="break-all">{model.email}</p> : null}
              {model.location ? <p>{model.location}</p> : null}
            </div>
          </div>
          <Portrait model={model} className="h-[124px] w-[112px] shrink-0 rounded-md" />
        </header>

        <div className="mt-6 space-y-5">
          <section>
            <RibbonHeading n="01" title="Profile" accent={accent} />
            <p className="text-[9.5px] leading-[1.8] text-gray-600">{model.summary}</p>
          </section>
          <section>
            <RibbonHeading n="02" title="Experience" accent={accent} />
            <div className="space-y-3.5">
              {model.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                    <p className="shrink-0 text-[9px] text-gray-400">{expDates(exp)}</p>
                  </div>
                  <p className="text-[9.5px] italic text-gray-500">{exp.company}</p>
                  <BulletLines text={exp.description} accent={accent} />
                </div>
              ))}
            </div>
          </section>
          <section>
            <RibbonHeading n="03" title="Education" accent={accent} />
            <div className="grid grid-cols-2 gap-x-7 gap-y-2.5">
              {model.education.map((e) => (
                <div key={e.id} className="text-[10px] leading-relaxed">
                  <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                  <p className="text-gray-600">{e.school}</p>
                  <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <RibbonHeading n="04" title="Skills" accent={accent} />
            <div className="grid grid-cols-2 gap-x-7">
              <ul className="space-y-1.5 text-[10px] text-gray-700">
                {model.skills.slice(0, Math.ceil(model.skills.length / 2)).map((sk) => (
                  <li key={sk.id} className="flex gap-2">
                    <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                    {sk.name}
                  </li>
                ))}
              </ul>
              <ul className="space-y-1.5 text-[10px] text-gray-700">
                {model.skills.slice(Math.ceil(model.skills.length / 2)).map((sk) => (
                  <li key={sk.id} className="flex gap-2">
                    <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                    {sk.name}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {model.certifications.length > 0 ? (
            <section>
              <RibbonHeading n="05" title="Certifications" accent={accent} />
              <CertList items={model.certifications} />
            </section>
          ) : null}
          {model.languages.length > 0 ? (
            <section>
              <RibbonHeading n="06" title="Languages" accent={accent} />
              <LanguageStars items={model.languages} accent={accent} />
            </section>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

function RibbonHeading({ n, title, accent }: { n: string; title: string; accent: string }) {
  return (
    <h2 className="mb-2.5 flex items-baseline gap-3">
      <span className="text-[15px] font-extrabold" style={{ color: `${accent}55` }}>{n}</span>
      <span className="text-[13px] font-bold uppercase tracking-[0.14em]">{title}</span>
      <span className="ml-1 h-px flex-1" style={{ backgroundColor: '#e5e7eb' }} />
    </h2>
  )
}

// Lattice — every section is its own bordered card, tiled two across.
function LatticeResume({ model }: { model: PreviewModel }) {
  const { accent, secondary } = model.template
  return (
    <Page className="px-7 py-7" style={{ backgroundColor: '#f6f6f7', color: INK }}>
      <header className="mb-3 flex items-center gap-5 rounded-xl px-6 py-5" style={{ backgroundColor: secondary }}>
        <Portrait model={model} className="h-[84px] w-[84px] shrink-0 rounded-lg" />
        <div className="min-w-0">
          <h1 className="text-[26px] font-extrabold leading-none tracking-tight text-white">{model.name}</h1>
          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{model.title}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[9px] text-white/65">
            {model.phone ? <span>{model.phone}</span> : null}
            {model.email ? <span>{model.email}</span> : null}
            {model.location ? <span>{model.location}</span> : null}
          </div>
        </div>
      </header>

      <LatticeCard title="Profile" accent={accent}>
        <p className="text-[9.5px] leading-[1.75] text-gray-600">{model.summary}</p>
      </LatticeCard>

      <div className="mt-3 grid grid-cols-[1fr_232px] gap-3">
        <LatticeCard title="Experience" accent={accent}>
          <div className="space-y-3.5">
            {model.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-bold">{exp.title || exp.jobTitle || 'Job Title'}</p>
                  <p className="shrink-0 text-[8.5px] text-gray-400">{expDates(exp)}</p>
                </div>
                <p className="text-[9.5px] italic text-gray-500">{exp.company}</p>
                <BulletLines text={exp.description} accent={accent} />
              </div>
            ))}
          </div>
        </LatticeCard>

        <div className="flex flex-col gap-3">
          <LatticeCard title="Education" accent={accent}>
            <div className="space-y-2.5 text-[9.5px] leading-relaxed">
              {model.education.map((e) => (
                <div key={e.id}>
                  <p className="font-bold">{[e.degree, e.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree'}</p>
                  <p className="text-gray-600">{e.school}</p>
                  <p className="text-gray-400">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</p>
                </div>
              ))}
            </div>
          </LatticeCard>
          <LatticeCard title="Skills" accent={accent}>
            <ul className="space-y-1.5 text-[9.5px] text-gray-700">
              {model.skills.map((sk) => (
                <li key={sk.id} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {sk.name}
                </li>
              ))}
            </ul>
          </LatticeCard>
          {model.languages.length > 0 ? (
            <LatticeCard title="Languages" accent={accent}>
              <ul className="space-y-1 text-[9.5px] text-gray-700">
                {model.languages.map((l) => (
                  <li key={l.id}>{l.name} <span className="text-gray-500">({l.proficiency})</span></li>
                ))}
              </ul>
            </LatticeCard>
          ) : null}
          {model.certifications.length > 0 ? (
            <LatticeCard title="Certifications" accent={accent}>
              <div className="space-y-2 text-[9.5px] leading-relaxed">
                {model.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-gray-500">{[c.issuer, c.date].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </LatticeCard>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

function LatticeCard({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
