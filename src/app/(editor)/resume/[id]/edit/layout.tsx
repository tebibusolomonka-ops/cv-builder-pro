import { ReactNode } from 'react'
import { EditorTopBar } from '@/components/editor/EditorTopBar'

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-hidden h-screen">
      <EditorTopBar />

      <main className="flex-1 flex overflow-hidden relative">
        {children}
      </main>
    </div>
  )
}
