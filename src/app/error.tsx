'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('[app] Unexpected page error', error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-center text-dark-100">
      <div className="max-w-lg rounded-2xl border border-dark-700 bg-surface-elevated p-8 shadow-2xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error-text">
          <AlertTriangle size={24} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Netsa CV hit a temporary problem</h1>
        <p className="mt-3 text-sm leading-relaxed text-dark-300">
          Your CV is saved in this browser. Try loading this page again; if the problem continues,
          return to your workspace and download a backup before clearing any browser data.
        </p>
        {error.digest ? <p className="mt-3 text-xs text-dark-500">Error reference: {error.digest}</p> : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-500"
          >
            <RefreshCw size={16} /> Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-dark-600 px-5 py-2.5 text-sm font-semibold text-dark-200 hover:border-dark-400 hover:text-white"
          >
            Return to workspace
          </Link>
        </div>
      </div>
    </main>
  )
}
