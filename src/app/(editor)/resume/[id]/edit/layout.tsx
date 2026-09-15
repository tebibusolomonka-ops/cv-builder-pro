import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { EditorTopBar } from '@/components/editor/EditorTopBar'

/**
 * The editor holds one person's half-finished CV, keyed by an id that only
 * means anything in their own browser. robots.txt already keeps crawlers out
 * of /resume/ -- this says the same thing on the page itself, so the rule
 * survives anyone later loosening robots.txt.
 */
export const metadata: Metadata = {
  title: 'CV Editor — Netsa CV',
  robots: { index: false, follow: false },
}

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
