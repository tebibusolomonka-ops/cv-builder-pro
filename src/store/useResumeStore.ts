import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ResumeData,
  ResumeStyle,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  Award,
  VolunteerExperience,
  Reference,
  ResumeSection,
  defaultResumeData,
} from '@/types/resume'
import { MAX_UNDO_HISTORY } from '@/lib/constants'

interface ResumeState {
  // Current resume data
  data: ResumeData
  resumeId: string | null
  title: string
  isDirty: boolean
  lastSaved: Date | null

  // Undo/Redo
  history: ResumeData[]
  historyIndex: number

  // Actions - Personal Info
  setPersonalInfo: (info: Partial<PersonalInfo>) => void
  setSummary: (summary: string) => void

  // Actions - Work Experience
  addWorkExperience: (exp: WorkExperience) => void
  updateWorkExperience: (id: string, exp: Partial<WorkExperience>) => void
  removeWorkExperience: (id: string) => void
  reorderWorkExperience: (startIndex: number, endIndex: number) => void

  // Actions - Education
  addEducation: (edu: Education) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  reorderEducation: (startIndex: number, endIndex: number) => void

  // Actions - Skills
  addSkill: (skill: Skill) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  removeSkill: (id: string) => void

  // Actions - Projects
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  removeProject: (id: string) => void

  // Actions - Certifications
  addCertification: (cert: Certification) => void
  updateCertification: (id: string, cert: Partial<Certification>) => void
  removeCertification: (id: string) => void

  // Actions - Languages
  addLanguage: (lang: Language) => void
  updateLanguage: (id: string, lang: Partial<Language>) => void
  removeLanguage: (id: string) => void

  // Actions - Awards
  addAward: (award: Award) => void
  updateAward: (id: string, award: Partial<Award>) => void
  removeAward: (id: string) => void

  // Actions - Volunteer
  addVolunteer: (vol: VolunteerExperience) => void
  updateVolunteer: (id: string, vol: Partial<VolunteerExperience>) => void
  removeVolunteer: (id: string) => void

  // Actions - References
  addReference: (ref: Reference) => void
  updateReference: (id: string, ref: Partial<Reference>) => void
  removeReference: (id: string) => void

  // Actions - Sections
  toggleSection: (sectionId: string) => void
  reorderSections: (sections: ResumeSection[]) => void

  // Actions - Style
  setStyle: (style: Partial<ResumeStyle>) => void
  setTemplate: (templateId: string) => void

  // Actions - Meta
  setResumeId: (id: string) => void
  setTitle: (title: string) => void
  loadResume: (id: string, title: string, data: ResumeData) => void
  resetResume: () => void
  markSaved: () => void

  // Actions - Undo/Redo
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const pushHistory = (state: ResumeState): Partial<ResumeState> => {
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(JSON.parse(JSON.stringify(state.data)))
  if (newHistory.length > MAX_UNDO_HISTORY) newHistory.shift()
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
    isDirty: true,
  }
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      data: defaultResumeData,
      resumeId: null,
      title: 'Untitled Resume',
      isDirty: false,
      lastSaved: null,
      history: [defaultResumeData],
      historyIndex: 0,

      // Personal Info
      setPersonalInfo: (info) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),

      setSummary: (summary) =>
        set((state) => ({
          ...pushHistory(state),
          data: { ...state.data, summary },
        })),

      // Work Experience
      addWorkExperience: (exp) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            workExperience: [...state.data.workExperience, exp],
          },
        })),

      updateWorkExperience: (id, exp) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            workExperience: state.data.workExperience.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            ),
          },
        })),

      removeWorkExperience: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            workExperience: state.data.workExperience.filter((e) => e.id !== id),
          },
        })),

      reorderWorkExperience: (startIndex, endIndex) =>
        set((state) => {
          const items = [...state.data.workExperience]
          const [removed] = items.splice(startIndex, 1)
          items.splice(endIndex, 0, removed)
          return {
            ...pushHistory(state),
            data: { ...state.data, workExperience: items },
          }
        }),

      // Education
      addEducation: (edu) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            education: [...state.data.education, edu],
          },
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            education: state.data.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            education: state.data.education.filter((e) => e.id !== id),
          },
        })),

      reorderEducation: (startIndex, endIndex) =>
        set((state) => {
          const items = [...state.data.education]
          const [removed] = items.splice(startIndex, 1)
          items.splice(endIndex, 0, removed)
          return {
            ...pushHistory(state),
            data: { ...state.data, education: items },
          }
        }),

      // Skills
      addSkill: (skill) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            skills: [...state.data.skills, skill],
          },
        })),

      updateSkill: (id, skill) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            skills: state.data.skills.map((s) =>
              s.id === id ? { ...s, ...skill } : s
            ),
          },
        })),

      removeSkill: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            skills: state.data.skills.filter((s) => s.id !== id),
          },
        })),

      // Projects
      addProject: (project) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            projects: [...state.data.projects, project],
          },
        })),

      updateProject: (id, project) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            projects: state.data.projects.map((p) =>
              p.id === id ? { ...p, ...project } : p
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            projects: state.data.projects.filter((p) => p.id !== id),
          },
        })),

      // Certifications
      addCertification: (cert) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            certifications: [...state.data.certifications, cert],
          },
        })),

      updateCertification: (id, cert) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            certifications: state.data.certifications.map((c) =>
              c.id === id ? { ...c, ...cert } : c
            ),
          },
        })),

      removeCertification: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            certifications: state.data.certifications.filter((c) => c.id !== id),
          },
        })),

      // Languages
      addLanguage: (lang) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            languages: [...state.data.languages, lang],
          },
        })),

      updateLanguage: (id, lang) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            languages: state.data.languages.map((l) =>
              l.id === id ? { ...l, ...lang } : l
            ),
          },
        })),

      removeLanguage: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            languages: state.data.languages.filter((l) => l.id !== id),
          },
        })),

      // Awards
      addAward: (award) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            awards: [...state.data.awards, award],
          },
        })),

      updateAward: (id, award) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            awards: state.data.awards.map((a) =>
              a.id === id ? { ...a, ...award } : a
            ),
          },
        })),

      removeAward: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            awards: state.data.awards.filter((a) => a.id !== id),
          },
        })),

      // Volunteer
      addVolunteer: (vol) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            volunteer: [...state.data.volunteer, vol],
          },
        })),

      updateVolunteer: (id, vol) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            volunteer: state.data.volunteer.map((v) =>
              v.id === id ? { ...v, ...vol } : v
            ),
          },
        })),

      removeVolunteer: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            volunteer: state.data.volunteer.filter((v) => v.id !== id),
          },
        })),

      // References
      addReference: (ref) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            references: [...state.data.references, ref],
          },
        })),

      updateReference: (id, ref) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            references: state.data.references.map((r) =>
              r.id === id ? { ...r, ...ref } : r
            ),
          },
        })),

      removeReference: (id) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            references: state.data.references.filter((r) => r.id !== id),
          },
        })),

      // Sections
      toggleSection: (sectionId) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            sections: state.data.sections.map((s) =>
              s.id === sectionId ? { ...s, visible: !s.visible } : s
            ),
          },
        })),

      reorderSections: (sections) =>
        set((state) => ({
          ...pushHistory(state),
          data: { ...state.data, sections },
        })),

      // Style
      setStyle: (style) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            style: { ...state.data.style, ...style },
          },
        })),

      setTemplate: (templateId) =>
        set((state) => ({
          ...pushHistory(state),
          data: {
            ...state.data,
            style: { ...state.data.style, templateId },
          },
        })),

      // Meta
      setResumeId: (id) => set({ resumeId: id }),
      setTitle: (title) => set({ title, isDirty: true }),

      loadResume: (id, title, data) =>
        set({
          resumeId: id,
          title,
          data,
          isDirty: false,
          history: [data],
          historyIndex: 0,
        }),

      resetResume: () =>
        set({
          data: defaultResumeData,
          resumeId: null,
          title: 'Untitled Resume',
          isDirty: false,
          lastSaved: null,
          history: [defaultResumeData],
          historyIndex: 0,
        }),

      markSaved: () => set({ isDirty: false, lastSaved: new Date() }),

      // Undo/Redo
      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return state
          const newIndex = state.historyIndex - 1
          return {
            data: JSON.parse(JSON.stringify(state.history[newIndex])),
            historyIndex: newIndex,
            isDirty: true,
          }
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state
          const newIndex = state.historyIndex + 1
          return {
            data: JSON.parse(JSON.stringify(state.history[newIndex])),
            historyIndex: newIndex,
            isDirty: true,
          }
        }),

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    }),
    {
      name: 'cv-builder-resume',
      partialize: (state) => ({
        data: state.data,
        resumeId: state.resumeId,
        title: state.title,
      }),
    }
  )
)
