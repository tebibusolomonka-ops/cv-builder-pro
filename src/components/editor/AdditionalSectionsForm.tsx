'use client'

import { useState } from 'react'
import { Award, BookOpen, Globe2, Plus, Trash2, UserRound } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useResumeStore } from '@/store/useResumeStore'
import { Language } from '@/types/resume'

type Panel = 'languages' | 'certifications' | 'projects' | 'references'

const panels: { id: Panel; label: string; icon: React.ReactNode }[] = [
  { id: 'languages', label: 'Languages', icon: <Globe2 size={16} /> },
  { id: 'certifications', label: 'Certifications', icon: <Award size={16} /> },
  { id: 'projects', label: 'Projects', icon: <BookOpen size={16} /> },
  { id: 'references', label: 'References', icon: <UserRound size={16} /> },
]

export function AdditionalSectionsForm() {
  const [activePanel, setActivePanel] = useState<Panel>('languages')

  return (
    <div className="space-y-5">
      <p className="text-sm text-dark-400">
        Add optional sections when they help your CV. They appear on the A4 preview as soon as you add them.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {panels.map((panel) => (
          <button
            key={panel.id}
            type="button"
            onClick={() => setActivePanel(panel.id)}
            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              activePanel === panel.id
                ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                : 'border-dark-700 bg-surface-elevated text-dark-300 hover:border-dark-600 hover:text-white'
            }`}
          >
            {panel.icon}
            {panel.label}
          </button>
        ))}
      </div>

      {activePanel === 'languages' && <LanguagesEditor />}
      {activePanel === 'certifications' && <CertificationsEditor />}
      {activePanel === 'projects' && <ProjectsEditor />}
      {activePanel === 'references' && <ReferencesEditor />}
    </div>
  )
}

function LanguagesEditor() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useResumeStore()

  return (
    <SectionShell
      empty={data.languages.length === 0}
      emptyText="No languages added yet."
      onAdd={() => addLanguage({ id: crypto.randomUUID(), name: '', proficiency: 'proficient' })}
    >
      {data.languages.map((language) => (
        <div key={language.id} className="rounded-xl border border-dark-700 bg-surface-elevated p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_170px_auto]">
            <Input
              label="Language"
              value={language.name}
              onChange={(event) => updateLanguage(language.id, { name: event.target.value })}
              placeholder="e.g. English"
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-300">Proficiency</label>
              <select
                value={language.proficiency}
                onChange={(event) => updateLanguage(language.id, { proficiency: event.target.value as Language['proficiency'] })}
                className="w-full rounded-xl border border-dark-600 bg-surface-elevated px-3 py-2.5 text-dark-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="basic">Basic</option>
                <option value="conversational">Conversational</option>
                <option value="proficient">Proficient</option>
                <option value="fluent">Fluent</option>
                <option value="native">Native</option>
              </select>
            </div>
            <RemoveButton onClick={() => removeLanguage(language.id)} />
          </div>
        </div>
      ))}
    </SectionShell>
  )
}

function CertificationsEditor() {
  const { data, addCertification, updateCertification, removeCertification } = useResumeStore()

  return (
    <SectionShell
      empty={data.certifications.length === 0}
      emptyText="No certifications added yet."
      onAdd={() => addCertification({ id: crypto.randomUUID(), name: '', issuer: '', date: '', expiryDate: '', url: '' })}
    >
      {data.certifications.map((certification) => (
        <div key={certification.id} className="rounded-xl border border-dark-700 bg-surface-elevated p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input label="Certification" value={certification.name} onChange={(event) => updateCertification(certification.id, { name: event.target.value })} placeholder="e.g. AWS Certified Developer" />
            <Input label="Issuer" value={certification.issuer} onChange={(event) => updateCertification(certification.id, { issuer: event.target.value })} placeholder="e.g. Amazon Web Services" />
            <Input label="Date" value={certification.date} onChange={(event) => updateCertification(certification.id, { date: event.target.value })} placeholder="e.g. 2024" />
            <Input label="URL" value={certification.url} onChange={(event) => updateCertification(certification.id, { url: event.target.value })} placeholder="Credential link" />
          </div>
          <div className="mt-3 flex justify-end"><RemoveButton onClick={() => removeCertification(certification.id)} /></div>
        </div>
      ))}
    </SectionShell>
  )
}

function ProjectsEditor() {
  const { data, addProject, updateProject, removeProject } = useResumeStore()

  return (
    <SectionShell
      empty={data.projects.length === 0}
      emptyText="No projects added yet."
      onAdd={() => addProject({ id: crypto.randomUUID(), name: '', description: '', url: '', startDate: '', endDate: '', technologies: [] })}
    >
      {data.projects.map((project) => (
        <div key={project.id} className="rounded-xl border border-dark-700 bg-surface-elevated p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input label="Project Name" value={project.name} onChange={(event) => updateProject(project.id, { name: event.target.value })} placeholder="e.g. Portfolio Website" />
            <Input label="Project URL" value={project.url} onChange={(event) => updateProject(project.id, { url: event.target.value })} placeholder="https://..." />
          </div>
          <label className="mt-3 block text-sm font-medium text-dark-300">Description</label>
          <textarea
            value={project.description}
            onChange={(event) => updateProject(project.id, { description: event.target.value })}
            placeholder="Briefly describe the project, stack, and outcome."
            className="mt-1.5 w-full min-h-[90px] rounded-xl border border-dark-600 bg-surface-elevated px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <div className="mt-3 flex justify-end"><RemoveButton onClick={() => removeProject(project.id)} /></div>
        </div>
      ))}
    </SectionShell>
  )
}

function ReferencesEditor() {
  const { data, addReference, updateReference, removeReference } = useResumeStore()

  return (
    <SectionShell
      empty={data.references.length === 0}
      emptyText="No references added yet."
      onAdd={() => addReference({ id: crypto.randomUUID(), name: '', title: '', company: '', email: '', phone: '', relationship: '' })}
    >
      {data.references.map((reference) => (
        <div key={reference.id} className="rounded-xl border border-dark-700 bg-surface-elevated p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input label="Name" value={reference.name} onChange={(event) => updateReference(reference.id, { name: event.target.value })} placeholder="e.g. Jane Smith" />
            <Input label="Title" value={reference.title} onChange={(event) => updateReference(reference.id, { title: event.target.value })} placeholder="e.g. Engineering Manager" />
            <Input label="Company" value={reference.company} onChange={(event) => updateReference(reference.id, { company: event.target.value })} placeholder="Company" />
            <Input label="Email" value={reference.email} onChange={(event) => updateReference(reference.id, { email: event.target.value })} placeholder="email@example.com" />
          </div>
          <div className="mt-3 flex justify-end"><RemoveButton onClick={() => removeReference(reference.id)} /></div>
        </div>
      ))}
    </SectionShell>
  )
}

function SectionShell({ children, empty, emptyText, onAdd }: { children: React.ReactNode; empty: boolean; emptyText: string; onAdd: () => void }) {
  return (
    <div className="space-y-4">
      {empty ? <p className="rounded-xl border border-dashed border-dark-700 py-6 text-center text-sm text-dark-400">{emptyText}</p> : children}
      <Button variant="outline" fullWidth onClick={onAdd} className="border-dashed border-dark-600 hover:border-primary-500 hover:bg-primary-500/10">
        <Plus size={18} className="mr-2" />
        Add Item
      </Button>
    </div>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-dark-400 transition-colors hover:bg-error/10 hover:text-error-text">
      <Trash2 size={18} />
    </button>
  )
}
