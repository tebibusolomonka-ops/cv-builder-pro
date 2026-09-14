'use client'

import { useState } from 'react'
import { Download, Upload, Trash2, AlertTriangle, Database } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

const BACKUP_FIELDS = [
  { field: 'resumeData', storageKey: 'cv-builder-resume', label: 'resume' },
  { field: 'applicationData', storageKey: 'cv-builder-applications', label: 'application' },
] as const

type ImportEntry = {
  storageKey: (typeof BACKUP_FIELDS)[number]['storageKey']
  value: string
}

function readBackupFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Could not read that backup file.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read that backup file.'))
    reader.onabort = () => reject(new Error('Backup loading was cancelled.'))
    reader.readAsText(file)
  })
}

function parseBackup(content: string): ImportEntry[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('That file is not valid JSON.')
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('That file is not a Netsa CV backup.')
  }

  const backup = parsed as Record<string, unknown>
  const entries: ImportEntry[] = []

  for (const { field, storageKey, label } of BACKUP_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(backup, field)) continue

    const value = backup[field]
    // Exports use null when one of the stores has no data. It is safe to skip,
    // but at least one recognized string is required below.
    if (value === null) continue
    if (typeof value !== 'string') {
      throw new Error(`The ${label} data in this backup is malformed.`)
    }

    let stored: unknown
    try {
      stored = JSON.parse(value)
    } catch {
      throw new Error(`The ${label} data in this backup is not valid JSON.`)
    }

    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
      throw new Error(`The ${label} data in this backup is malformed.`)
    }

    const state = (stored as Record<string, unknown>).state
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      throw new Error(`The ${label} data in this backup has no usable state.`)
    }

    const storeState = state as Record<string, unknown>
    if (storageKey === 'cv-builder-resume') {
      if (!storeState.data || typeof storeState.data !== 'object' || Array.isArray(storeState.data)) {
        throw new Error('The resume data in this backup is malformed.')
      }
    } else if (!Array.isArray(storeState.applications)) {
      throw new Error('The application data in this backup is malformed.')
    }

    entries.push({ storageKey, value })
  }

  if (entries.length === 0) {
    throw new Error('This file does not contain resume or application backup data.')
  }

  return entries
}

function commitBackup(entries: ImportEntry[]) {
  const previousValues = new Map<ImportEntry['storageKey'], string | null>()

  try {
    for (const { storageKey } of entries) {
      previousValues.set(storageKey, localStorage.getItem(storageKey))
    }
  } catch {
    throw new Error('Browser storage is unavailable. Your existing data was not changed.')
  }

  const writtenKeys: ImportEntry['storageKey'][] = []
  try {
    for (const { storageKey, value } of entries) {
      localStorage.setItem(storageKey, value)
      writtenKeys.push(storageKey)
    }
  } catch {
    let rollbackFailed = false

    for (const storageKey of writtenKeys.reverse()) {
      try {
        const previousValue = previousValues.get(storageKey)
        if (previousValue === null || previousValue === undefined) {
          localStorage.removeItem(storageKey)
        } else {
          localStorage.setItem(storageKey, previousValue)
        }
      } catch {
        rollbackFailed = true
      }
    }

    if (rollbackFailed) {
      throw new Error('Import failed and the browser could not fully restore the previous data.')
    }
    throw new Error('Import could not be saved. Your existing data was restored.')
  }
}

export default function SettingsPage() {
  const [isWiping, setIsWiping] = useState(false)

  const handleExportData = () => {
    try {
      const data = {
        resumeData: localStorage.getItem('cv-builder-resume'),
        applicationData: localStorage.getItem('cv-builder-applications'),
        exportDate: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cv-builder-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully!')
    } catch {
      toast.error('Failed to export data')
    }
  }

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const file = input.files?.[0]
    if (!file) return

    let importSucceeded = false
    try {
      const content = await readBackupFile(file)
      const entries = parseBackup(content)
      commitBackup(entries)
      importSucceeded = true
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not import that backup.')
    } finally {
      // Let users retry the same file after correcting a storage or file issue.
      input.value = ''
    }

    if (importSucceeded) {
      toast.success('Data imported successfully. Reloading...')
      window.location.reload()
    }
  }

  const handleWipeData = () => {
    if (!isWiping) {
      setIsWiping(true)
      return
    }

    localStorage.removeItem('cv-builder-resume')
    localStorage.removeItem('cv-builder-applications')
    toast.success('All local data has been wiped. Reloading...')
    setTimeout(() => window.location.reload(), 1500)
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-dark-100 font-heading">
          Settings
        </h1>
        <p className="text-dark-400 mt-1">Manage your local storage data and application preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-dark-700/50">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-100">Data Management</h2>
              <p className="text-sm text-dark-400">Your data is stored locally in your browser. Backup frequently to avoid data loss.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-dark-700 bg-dark-800/50">
              <div>
                <h3 className="font-semibold text-dark-100">Export Backup</h3>
                <p className="text-sm text-dark-400 mt-1">Download all your resumes and applications as a JSON file.</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download size={18} className="mr-2" />
                Export JSON
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-dark-700 bg-dark-800/50">
              <div>
                <h3 className="font-semibold text-dark-100">Import Backup</h3>
                <p className="text-sm text-dark-400 mt-1">Restore your data from a previously exported JSON backup file.</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  aria-label="Import JSON backup"
                  className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImportData}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-flex items-center justify-center gap-2 rounded-lg border border-dark-500 bg-transparent px-4 py-2 text-sm font-medium text-dark-200"
                >
                  <Upload size={18} />
                  Import JSON
                </span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-dark-700/50">
              <h3 className="font-bold text-error-text flex items-center gap-2 mb-4">
                <AlertTriangle size={20} />
                Danger Zone
              </h3>
              <div className="flex items-center justify-between p-4 rounded-xl border border-error/25 bg-error/5">
                <div>
                  <h3 className="font-semibold text-dark-100">Wipe Local Storage</h3>
                  <p className="text-sm text-primary-300 mt-1">Permanently delete all resumes and applications from your browser.</p>
                </div>
                <Button 
                  variant={isWiping ? "primary" : "outline"}
                  onClick={handleWipeData}
                  className={isWiping ? "bg-primary-700 hover:bg-primary-600 text-white" : "text-primary-300 border-error/50 hover:bg-error/10"}
                >
                  <Trash2 size={18} className="mr-2" />
                  {isWiping ? 'Click again to confirm' : 'Wipe Data'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
