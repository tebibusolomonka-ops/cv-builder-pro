'use client'

import { useRef } from 'react'
import { Download, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { useResumeStore } from '@/store/useResumeStore'
import type { ResumeData } from '@/types/resume'

// Local resumes can be moved between devices with a JSON backup.

const BACKUP_VERSION = 1

/**
 * Marker written into every backup file so a stray JSON cannot overwrite a
 * resume. It changed with the rename to Netsa CV, so files written before the
 * rename carry the old id — keep accepting them forever. A backup is the one
 * copy of a user's CV that survives clearing browser data; refusing to read an
 * older one would destroy exactly the data the feature exists to protect.
 */
const BACKUP_APP_ID = 'netsa-cv'
const ACCEPTED_APP_IDS: readonly string[] = [BACKUP_APP_ID, 'cv-builder-pro']

interface Backup {
  app: string
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
  if (typeof b?.app !== 'string' || !ACCEPTED_APP_IDS.includes(b.app)) {
    throw new Error('That file was not created by Netsa CV.')
  }
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    throw new Error('That backup was made by a newer version of the app.')
  }
  if (!b.data || typeof b.data !== 'object' || !('personalInfo' in b.data)) {
    throw new Error('That backup has no CV inside it.')
  }
  return b as Backup
}

export function BackupControls() {
  const { title, data, loadResume } = useResumeStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDownload = () => {
    const backup: Backup = {
      app: BACKUP_APP_ID,
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
    a.download = `${(title || 'cv').replace(/[^\w\-]+/g, '-').toLowerCase()}-backup.json`
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
        title="Save a copy of your CV on your computer"
        className="focus-ring flex items-center gap-2 rounded-lg border border-dark-700 px-3 py-2 text-sm text-dark-300 transition-colors hover:border-primary-500/50 hover:text-dark-100"
      >
        <Download size={15} />
        <span className="hidden sm:inline">Backup</span>
      </button>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title="Load a CV from a backup file"
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
