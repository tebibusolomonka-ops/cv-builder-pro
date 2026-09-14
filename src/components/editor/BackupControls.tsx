'use client'

import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'

// Local resumes can be moved between devices with a JSON backup.

const BACKUP_VERSION = 1

interface Backup {
  app: 'cv-builder-pro'
  version: number
  exportedAt: string
  title: string
  data: ResumeData
}

// Validate before replacing the current resume.
function parseBackup(raw: string): Backup {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('That file is not valid JSON.')
  }

  const b = parsed as Partial<Backup>
  if (b?.app !== 'cv-builder-pro') {
    throw new Error('That file was not created by CV Builder Pro.')
  }
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    throw new Error('That backup was made by a newer version of the app.')
  }
  if (!b.data || typeof b.data !== 'object' || !('personalInfo' in b.data)) {
    throw new Error('That backup is missing its resume content.')
  }
  return b as Backup
}

export function BackupControls() {
  const { title, data, loadResume } = useResumeStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDownload = () => {
    const backup: Backup = {
      app: 'cv-builder-pro',
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      title,
      data,
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    )
    const a = document.createElement('a')
    a.href = url
    a.download = `${(title || 'resume').replace(/[^\w\-]+/g, '-').toLowerCase()}-backup.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup downloaded')
  }

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset immediately so picking the same file twice still fires onChange.
    e.target.value = ''
    if (!file) return

    try {
      const backup = parseBackup(await file.text())
      loadResume('1', backup.title || 'Untitled Resume', backup.data)
      toast.success('Backup restored')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not read that file')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        title="Save a copy of this resume to your computer"
        className="focus-ring flex items-center gap-2 rounded-lg border border-dark-700 px-3 py-2 text-sm text-dark-300 transition-colors hover:border-primary-500/50 hover:text-dark-100"
      >
        <Download size={15} />
        <span className="hidden sm:inline">Backup</span>
      </button>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title="Load a resume from a backup file"
        className="focus-ring flex items-center gap-2 rounded-lg border border-dark-700 px-3 py-2 text-sm text-dark-300 transition-colors hover:border-primary-500/50 hover:text-dark-100"
      >
        <Upload size={15} />
        <span className="hidden sm:inline">Restore</span>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        onChange={handleRestore}
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />
    </>
  )
}
