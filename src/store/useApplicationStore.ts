import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ApplicationStatus = 'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED'

export interface JobApplication {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  dateApplied?: string
  location?: string
  salary?: string
  notes?: string
}

interface ApplicationState {
  applications: JobApplication[]
  addApplication: (app: Omit<JobApplication, 'id'>) => void
  updateApplication: (id: string, app: Partial<JobApplication>) => void
  deleteApplication: (id: string) => void
  moveApplication: (id: string, newStatus: ApplicationStatus) => void
  resetApplications: () => void
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      applications: [],
      
      addApplication: (app) => set((state) => ({
        applications: [
          ...state.applications,
          { ...app, id: crypto.randomUUID() }
        ]
      })),

      updateApplication: (id, appUpdates) => set((state) => ({
        applications: state.applications.map(app => 
          app.id === id ? { ...app, ...appUpdates } : app
        )
      })),

      deleteApplication: (id) => set((state) => ({
        applications: state.applications.filter(app => app.id !== id)
      })),

      moveApplication: (id, newStatus) => set((state) => ({
        applications: state.applications.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      })),

      resetApplications: () => set({ applications: [] })
    }),
    {
      name: 'cv-builder-applications',
    }
  )
)
