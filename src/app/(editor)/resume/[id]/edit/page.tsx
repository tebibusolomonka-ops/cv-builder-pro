'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlignLeft,
  Briefcase,
  Check,
  ChevronDown,
  GraduationCap,
  Layers,
  ListChecks,
  User,
} from 'lucide-react'
import { PersonalInfoForm } from '@/components/editor/PersonalInfoForm'
import { SummaryForm } from '@/components/editor/SummaryForm'
import { ExperienceForm } from '@/components/editor/ExperienceForm'
import { EducationForm } from '@/components/editor/EducationForm'
import { SkillsForm } from '@/components/editor/SkillsForm'
import { AdditionalSectionsForm } from '@/components/editor/AdditionalSectionsForm'
import { LiveResumePreview } from '@/components/editor/LiveResumePreview'
import { ResumePreviewFrame } from '@/components/editor/ResumePreviewFrame'
import { TEMPLATES } from '@/lib/constants'
import { useResumeStore } from '@/store/useResumeStore'
import { cn } from '@/utils/cn'

type SectionId = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'extras'

export default function ResumeEditorPage() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(['personal']))
  const searchParams = useSearchParams()
  const { data, setTemplate } = useResumeStore()
  const selectedTemplateId = searchParams.get('template')
  const effectiveTemplateId = selectedTemplateId || data.style.templateId

  useEffect(() => {
    if (selectedTemplateId && selectedTemplateId !== data.style.templateId) {
      setTemplate(selectedTemplateId)
    }
  }, [data.style.templateId, selectedTemplateId, setTemplate])

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((template) => template.id === effectiveTemplateId) ?? TEMPLATES[0],
    [effectiveTemplateId]
  )
  const templateStyle =
    selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1)
  const templateStructure = selectedTemplate.columns === 1 ? 'Single column' : 'Two columns'

  const info = data.personalInfo
  const sections: {
    id: SectionId
    title: string
    hint: string
    icon: React.ComponentType<{ size?: number | string }>
    done: boolean
    content: React.ReactNode
  }[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      hint: 'Name, title, and how to reach you',
      icon: User,
      done: Boolean(info.fullName && info.email && info.phone),
      content: <PersonalInfoForm />,
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      hint: 'A few sentences that sell your story',
      icon: AlignLeft,
      done: data.summary.trim().length >= 40,
      content: <SummaryForm />,
    },
    {
      id: 'experience',
      title: 'Work Experience',
      hint: 'Roles, companies, and your impact',
      icon: Briefcase,
      done: data.workExperience.length >= 1,
      content: <ExperienceForm />,
    },
    {
      id: 'education',
      title: 'Education',
      hint: 'Degrees, schools, and dates',
      icon: GraduationCap,
      done: data.education.length >= 1,
      content: <EducationForm />,
    },
    {
      id: 'skills',
      title: 'Skills',
      hint: 'What you are great at',
      icon: ListChecks,
      done: data.skills.length >= 3,
      content: <SkillsForm />,
    },
    {
      id: 'extras',
      title: 'Additional Sections',
      hint: 'Languages, projects, certificates, references',
      icon: Layers,
      done: data.languages.length + data.projects.length + data.certifications.length > 0,
      content: <AdditionalSectionsForm />,
    },
  ]

  const doneCount = sections.filter((s) => s.done).length
  const progress = Math.round((doneCount / sections.length) * 100)

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openOnly = (id: SectionId) => {
    setOpenSections(new Set<SectionId>([id]))
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div
        className={`w-full lg:w-[45%] xl:w-[40%] flex-col bg-surface border-r border-dark-800 overflow-y-auto no-print ${
          activeTab === 'edit' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <div className="sticky top-0 z-20 border-b border-dark-800 bg-surface/95 backdrop-blur-md">
          <div className="px-6 pb-0 pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-400">Editor</p>
                <h2 className="mt-1 font-heading text-xl font-bold text-white">Build your resume</h2>
              </div>
              <div className="pb-0.5 text-right">
                <p className="font-heading text-lg font-bold text-primary-400">{progress}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-400">complete</p>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-dark-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-indigo transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none]">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => openOnly(section.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                  openSections.has(section.id)
                    ? 'border-primary-500/50 bg-primary-500/10 text-primary-300'
                    : 'border-dark-700 bg-dark-900 text-dark-400 hover:border-dark-500 hover:text-white'
                )}
              >
                {section.done && <Check size={11} strokeWidth={3} className="text-success" />}
                {section.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-6 pb-24">
          {sections.map((section) => {
            const isOpen = openSections.has(section.id)
            return (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className={cn(
                  'scroll-mt-32 overflow-hidden rounded-2xl border transition-colors duration-300',
                  isOpen ? 'border-primary-500/30 bg-surface-elevated' : 'border-dark-800 bg-surface-elevated/50 hover:border-dark-600'
                )}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                      section.done
                        ? 'bg-success/15 text-success'
                        : isOpen
                        ? 'bg-gradient-to-br from-primary-500 to-accent-indigo text-white shadow-lg shadow-primary-500/20'
                        : 'bg-dark-800 text-dark-400'
                    )}
                  >
                    {section.done ? <Check size={18} strokeWidth={3} /> : <section.icon size={18} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-[15px] font-bold text-white">{section.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-dark-400">{section.hint}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn('shrink-0 text-dark-500 transition-transform duration-300', isOpen && 'rotate-180 text-primary-400')}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-dark-800 p-5">{section.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className={`flex-1 border-l border-primary-500/10 bg-[#130d0c] bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(184,68,46,0.14),transparent_70%)] flex-col items-center justify-start overflow-y-auto p-4 sm:p-8 ${
          activeTab === 'preview' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <div className="w-full max-w-3xl justify-center sticky top-0 pb-4 z-10 hidden lg:flex no-print">
          <div className="bg-surface-elevated/90 backdrop-blur-md border border-primary-500/20 rounded-full px-4 py-2 flex items-center gap-4 text-sm text-dark-300 shadow-xl shadow-black/20">
            <span>Template: <strong className="font-semibold text-dark-100">{selectedTemplate.name}</strong></span>
            <div className="w-px h-4 bg-dark-600" />
            <span>Style: <strong className="font-semibold text-dark-100">{templateStyle}</strong></span>
            <div className="w-px h-4 bg-dark-600" />
            <span>Structure: <strong className="font-semibold text-dark-100">{templateStructure}</strong></span>
          </div>
        </div>

        <ResumePreviewFrame>
          <LiveResumePreview templateId={effectiveTemplateId} />
        </ResumePreviewFrame>
      </div>

      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-16 bg-surface-elevated border-t border-dark-800 flex items-center p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] no-print">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 h-full rounded-lg flex items-center justify-center font-medium transition-colors ${
            activeTab === 'edit' ? 'bg-dark-700 text-white' : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 h-full rounded-lg flex items-center justify-center font-medium transition-colors ${
            activeTab === 'preview' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-dark-200'
          }`}
        >
          Preview
        </button>
      </div>
    </>
  )
}
