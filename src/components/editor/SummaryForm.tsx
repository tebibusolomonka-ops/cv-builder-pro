'use client'

import { useResumeStore } from '@/store/useResumeStore'

export function SummaryForm() {
  const { data, setSummary } = useResumeStore()

  return (
    <div className="space-y-4">
      <p className="text-sm text-dark-400">
        Write a 2-4 sentence professional summary highlighting your key achievements and skills. 
        This is the first thing recruiters read, so make it impactful!
      </p>
      
      <div className="relative">
        <textarea
          value={data.summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="e.g. Results-driven Software Engineer with 5+ years of experience building scalable web applications..."
          className="w-full min-h-[160px] rounded-xl bg-surface-elevated border border-dark-700 text-white placeholder-dark-500 px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-y"
        />
        <div className="absolute bottom-3 right-3 text-xs text-dark-400">
          {data.summary.length} / 500
        </div>
      </div>
    </div>
  )
}
