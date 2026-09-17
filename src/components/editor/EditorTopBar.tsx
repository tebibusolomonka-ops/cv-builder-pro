'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Save } from 'lucide-react'
import { Button } from '@/components/ui'
import { useResumeStore } from '@/store/useResumeStore'
import { toast } from 'react-hot-toast'
import { BackupControls } from './BackupControls'

export function EditorTopBar() {
  const { title, setTitle, markSaved } = useResumeStore()

  const handleSaveDraft = () => {
    markSaved()
    toast.success('Draft saved locally!')
  }

  // The browser print dialog uses document.title as the filename.
  useEffect(() => {
    const safeName =
      (title || 'CV')
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '') // characters Windows rejects in filenames
        .replace(/\s+/g, '-')
        .slice(0, 80) || 'Resume'

    let previous = ''
    // Next can replace an imperative title change before printing.
    const onBefore = () => {
      previous = document.title
      document.title = safeName
    }
    // Restore the page title after the print dialog closes.
    const onAfter = () => {
      if (previous) document.title = previous
    }

    window.addEventListener('beforeprint', onBefore)
    window.addEventListener('afterprint', onAfter)
    return () => {
      window.removeEventListener('beforeprint', onBefore)
      window.removeEventListener('afterprint', onAfter)
    }
  }, [title])

  const [isExporting, setIsExporting] = useState(false)

  // Fall back to the print dialog when server-side PDF rendering is unavailable.
  const handleExportPDF = async () => {
    setIsExporting(true)
    const toastId = toast.loading('Building your PDF…')
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          // An untouched resume may not have a persisted copy yet.
          storeState:
            localStorage.getItem('cv-builder-resume') ??
            JSON.stringify({ state: useResumeStore.getState(), version: 0 }),
        }),
      })
      if (!response.ok) throw new Error(await response.text())

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${(title || 'CV').trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '-') || 'Resume'}.pdf`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('PDF downloaded', { id: toastId })
    } catch {
      toast.dismiss(toastId)
      toast('Opening the print dialog instead…')
      window.print()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <header className="h-16 border-b border-dark-700 bg-surface-elevated flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 no-print">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className="text-dark-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-dark-700 hidden sm:block mx-2" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Resume"
            className="text-sm sm:text-base font-semibold text-white bg-transparent border border-transparent hover:border-dark-600 focus:border-primary-500 focus:bg-dark-900/50 outline-none px-2 py-1 rounded-lg transition-all truncate w-full min-w-0 sm:w-[250px] sm:flex-none"
          />
          <span className="hidden shrink-0 rounded border border-dark-700 bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-dark-300 sm:inline sm:text-xs">
            DRAFT
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-dark-200 border-dark-600 hover:bg-surface-elevated hidden sm:flex"
            onClick={handleSaveDraft}
          >
            <Save size={16} className="mr-2 text-primary-400" />
            Save Draft
          </Button>
          <BackupControls />
          <Button
            variant="gradient"
            size="sm"
            // The primary action on a phone, so it gets a full-height tap
            // target. Height costs nothing here; width is the scarce axis.
            className="min-h-[40px]"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <Download size={18} className="sm:mr-2" />
            <span className="hidden sm:inline">
              {isExporting ? 'Preparing…' : 'Export PDF'}
            </span>
          </Button>
        </div>
      </header>
    </>
  )
}
