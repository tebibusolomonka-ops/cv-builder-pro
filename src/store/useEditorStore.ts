import { create } from 'zustand'

type ViewMode = 'desktop' | 'mobile' | 'print'
type EditorTab = 'edit' | 'preview'

interface EditorState {
  // Zoom
  zoom: number
  setZoom: (zoom: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void

  // View mode
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  // Active section
  activeSection: string | null
  setActiveSection: (section: string | null) => void

  // Mobile tab
  mobileTab: EditorTab
  setMobileTab: (tab: EditorTab) => void

  // Panel sizes
  editorPanelSize: number
  setEditorPanelSize: (size: number) => void

  // Customize panel
  customizePanelOpen: boolean
  setCustomizePanelOpen: (open: boolean) => void

  // Auto save
  autoSaveEnabled: boolean
  setAutoSaveEnabled: (enabled: boolean) => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void
}

export const useEditorStore = create<EditorState>()((set) => ({
  // Zoom
  zoom: 100,
  setZoom: (zoom) => set({ zoom: Math.min(200, Math.max(50, zoom)) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(200, state.zoom + 10) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(50, state.zoom - 10) })),
  resetZoom: () => set({ zoom: 100 }),

  // View mode
  viewMode: 'desktop',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Active section
  activeSection: 'personalInfo',
  setActiveSection: (section) => set({ activeSection: section }),

  // Mobile tab
  mobileTab: 'edit',
  setMobileTab: (tab) => set({ mobileTab: tab }),

  // Panel sizes
  editorPanelSize: 45,
  setEditorPanelSize: (size) => set({ editorPanelSize: size }),

  // Customize panel
  customizePanelOpen: false,
  setCustomizePanelOpen: (open) => set({ customizePanelOpen: open }),

  // Auto save
  autoSaveEnabled: true,
  setAutoSaveEnabled: (enabled) => set({ autoSaveEnabled: enabled }),
  saveStatus: 'idle',
  setSaveStatus: (status) => set({ saveStatus: status }),
}))
