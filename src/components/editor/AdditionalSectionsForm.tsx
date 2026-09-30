'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useResumeStore } from '@/store/useResumeStore'
import { CefrGrid, CefrLevel, Language } from '@/types/resume'
import { useTemplateFields } from './useTemplateFields'

/** The CEFR scale, worst to best. */
const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const CEFR_FIELDS: { key: keyof CefrGrid; label: string }[] = [
  { key: 'listening', label: 'Listening' },
  { key: 'reading', label: 'Reading' },
  { key: 'spokenInteraction', label: 'Spoken interaction' },
  { key: 'spokenProduction', label: 'Spoken production' },
  { key: 'writing', label: 'Writing' },
]

/**
 * The five-skill grid a Europass CV grades separately.
 *
 * Shown only for the template that prints it. Every other layout has one
 * overall proficiency, and asking five questions per language for a CV that
 * prints none of them would be work thrown away.
 */
function CefrEditor({
  value,
  onChange,
}: {
  value: CefrGrid | undefined
  onChange: (next: CefrGrid) => void
}) {
  return (
    <div className="mt-3 rounded-lg border border-dark-700 bg-surface p-3">
      <p className="mb-2 text-xs text-dark-400">
        Europass CVs grade each skill on its own. A1 and A2 are a basic user, B1
        and B2 independent, C1 and C2 proficient.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {CEFR_FIELDS.map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="block text-[11px] font-medium text-dark-300">{field.label}</label>
            <select
              value={value?.[field.key] ?? ''}
              onChange={(event) =>
                onChange({
                  ...value,
                  [field.key]: (event.target.value || undefined) as CefrLevel | undefined,
                })
              }
              className="w-full rounded-lg border border-dark-600 bg-surface-elevated px-2 py-1.5 text-sm text-dark-100 focus:border-primary-500 focus:outline-none"
            >
              <option value="">--</option>
              {CEFR_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LanguagesEditor() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useResumeStore()
  const { uses } = useTemplateFields()
  const graded = uses('cefr')

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

          {graded ? (
            <>
              <label className="mt-3 flex items-center gap-2 text-sm text-dark-300">
                <input
                  type="checkbox"
                  checked={Boolean(language.motherTongue)}
                  onChange={(event) =>
                    updateLanguage(language.id, { motherTongue: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-dark-600 bg-surface-elevated accent-primary-500"
                />
                This is my mother tongue
              </label>
              {/*
                A mother tongue is listed by name on a Europass CV, never
                graded, so the grid would be dead weight here.
              */}
              {language.motherTongue ? null : (
                <CefrEditor
                  value={language.cefr}
                  onChange={(next) => updateLanguage(language.id, { cefr: next })}
                />
              )}
            </>
          ) : null}
        </div>
      ))}
    </SectionShell>
  )
}

export function CertificationsEditor() {
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

export function ProjectsEditor() {
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

export function ReferencesEditor() {
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

export function AwardsEditor() {
  const { data, addAward, updateAward, removeAward } = useResumeStore()

  return (
    <SectionShell
      empty={data.awards.length === 0}
      emptyText="No honours or awards added yet."
      onAdd={() => addAward({ id: crypto.randomUUID(), title: '', issuer: '', date: '', description: '' })}
    >
      {data.awards.map((award) => (
        <div key={award.id} className="rounded-xl border border-dark-700 bg-surface-elevated p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input label="Award or honour" value={award.title} onChange={(event) => updateAward(award.id, { title: event.target.value })} placeholder="e.g. Department Gold Medal" />
            <Input label="Awarded by" value={award.issuer} onChange={(event) => updateAward(award.id, { issuer: event.target.value })} placeholder="Institution or organisation" />
            <Input label="Date" value={award.date} onChange={(event) => updateAward(award.id, { date: event.target.value })} placeholder="e.g. August 2024" />
          </div>
          <label className="mt-3 block text-sm font-medium text-dark-300">Description</label>
          <textarea value={award.description} onChange={(event) => updateAward(award.id, { description: event.target.value })} placeholder="What was the honour awarded for?" className="mt-1.5 min-h-[90px] w-full rounded-xl border border-dark-600 bg-surface-elevated px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          <div className="mt-3 flex justify-end"><RemoveButton onClick={() => removeAward(award.id)} /></div>
        </div>
      ))}
    </SectionShell>
  )
}

export function VolunteerEditor() {
  const { data, addVolunteer, updateVolunteer, removeVolunteer } = useResumeStore()

  return (
    <SectionShell
      empty={data.volunteer.length === 0}
      emptyText="No volunteering added yet."
      onAdd={() => addVolunteer({ id: crypto.randomUUID(), organization: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' })}
    >
      {data.volunteer.map((item) => (
        <div key={item.id} className="rounded-xl border border-dark-700 bg-surface-elevated p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input label="Role" value={item.role} onChange={(event) => updateVolunteer(item.id, { role: event.target.value })} placeholder="e.g. Organizer" />
            <Input label="Organisation" value={item.organization} onChange={(event) => updateVolunteer(item.id, { organization: event.target.value })} placeholder="e.g. Community volunteer team" />
            <Input label="Location" value={item.location} onChange={(event) => updateVolunteer(item.id, { location: event.target.value })} placeholder="City, country" />
            <Input label="Start date" value={item.startDate} onChange={(event) => updateVolunteer(item.id, { startDate: event.target.value })} placeholder="e.g. March 2021" />
            <Input label="End date" value={item.endDate} onChange={(event) => updateVolunteer(item.id, { endDate: event.target.value })} placeholder="e.g. January 2023" />
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-dark-300">
              <input type="checkbox" checked={item.current} onChange={(event) => updateVolunteer(item.id, { current: event.target.checked })} className="h-4 w-4 accent-primary-500" />
              I currently volunteer here
            </label>
          </div>
          <label className="mt-3 block text-sm font-medium text-dark-300">What you did</label>
          <textarea value={item.description} onChange={(event) => updateVolunteer(item.id, { description: event.target.value })} placeholder="Add one achievement or responsibility per line." className="mt-1.5 min-h-[100px] w-full rounded-xl border border-dark-600 bg-surface-elevated px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          <div className="mt-3 flex justify-end"><RemoveButton onClick={() => removeVolunteer(item.id)} /></div>
        </div>
      ))}
    </SectionShell>
  )
}

export function NarrativeEditor({ kind }: { kind: 'hobbies' | 'organisationalSkills' }) {
  const value = useResumeStore((state) => state.data[kind] ?? '')
  const setValue = useResumeStore((state) => kind === 'hobbies' ? state.setHobbies : state.setOrganisationalSkills)
  const hobbies = kind === 'hobbies'
  return (
    <div>
      <label className="block text-sm font-medium text-dark-300">{hobbies ? 'Hobbies and interests' : 'Organisational and leadership skills'}</label>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={hobbies ? 'e.g. Literature, community service, reading and mentoring' : 'Describe leadership, organisation, coordination, or team-management experience.'}
        className="mt-1.5 min-h-[130px] w-full rounded-xl border border-dark-600 bg-surface-elevated px-3 py-2 text-sm text-white placeholder:text-dark-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      />
    </div>
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
