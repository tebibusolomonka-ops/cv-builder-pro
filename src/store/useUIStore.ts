import { create } from 'zustand'

interface UIState {
  // Workspace search
  resumeSearchQuery: string
  setResumeSearchQuery: (query: string) => void

  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Modals
  activeModal: string | null
  modalData: Record<string, unknown> | null
  openModal: (modal: string, data?: Record<string, unknown>) => void
  closeModal: () => void

  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void

  // Command Palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  // Loading
  isLoading: boolean
  loadingMessage: string
  setLoading: (loading: boolean, message?: string) => void
}

export const useUIStore = create<UIState>()((set) => ({
  // Workspace search
  resumeSearchQuery: '',
  setResumeSearchQuery: (query) => set({ resumeSearchQuery: query }),

  // Sidebar
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Modals
  activeModal: null,
  modalData: null,
  openModal: (modal, data) => set({ activeModal: modal, modalData: data || null }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Theme
  theme: 'dark',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),

  // Command Palette
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  // Loading
  isLoading: false,
  loadingMessage: '',
  setLoading: (loading, message) =>
    set({ isLoading: loading, loadingMessage: message || '' }),
}))
