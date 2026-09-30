'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { Input, Button } from '@/components/ui'
import { Plus, X } from 'lucide-react'
import type { Skill } from '@/types/resume'

const SKILL_LEVELS: { value: Skill['level']; label: string; percent: number }[] = [
  { value: 'beginner', label: 'Beginner', percent: 25 },
  { value: 'intermediate', label: 'Intermediate', percent: 50 },
  { value: 'advanced', label: 'Advanced', percent: 75 },
  { value: 'expert', label: 'Expert', percent: 100 },
]

function percentFor(level: Skill['level']) {
  return SKILL_LEVELS.find((option) => option.value === level)?.percent ?? 50
}

function levelFor(percent: number): Skill['level'] {
  return SKILL_LEVELS.find((option) => option.percent === percent)?.value ?? 'intermediate'
}

export function SkillsForm() {
  const { data, addSkill, updateSkill, removeSkill } = useResumeStore()
  const [newSkill, setNewSkill] = useState('')
  const [newLevel, setNewLevel] = useState<Skill['level']>('intermediate')

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    addSkill({
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      level: newLevel,
    })
    setNewSkill('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddSkill} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_150px_auto]">
        <div className="flex-1">
          <Input
            name="skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. React.js, Project Management..."
          />
        </div>
        <select
          aria-label="New skill level"
          value={newLevel}
          onChange={(event) => setNewLevel(event.target.value as Skill['level'])}
          className="rounded-xl border border-dark-600 bg-surface-elevated px-3 py-2.5 text-sm text-dark-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          {SKILL_LEVELS.map((option) => (
            <option key={option.value} value={option.value}>{option.percent}% · {option.label}</option>
          ))}
        </select>
        <Button type="submit" variant="gradient" className="shrink-0 pt-[2px]">
          <Plus size={18} />
        </Button>
      </form>

      <div className="space-y-3 pt-2">
        {data.skills.map((skill) => (
          <div
            key={skill.id}
            className="rounded-xl border border-dark-600 bg-surface-elevated px-4 py-3 text-sm text-white"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{skill.name}</span>
              <div className="flex items-center gap-3">
                <span className="min-w-10 text-right font-semibold text-primary-300">{percentFor(skill.level)}%</span>
                <button
                  type="button"
                  aria-label={`Remove ${skill.name}`}
                  onClick={() => removeSkill(skill.id)}
                  className="text-dark-400 transition-colors hover:text-error-text"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="25"
              max="100"
              step="25"
              value={percentFor(skill.level)}
              aria-label={`${skill.name} skill level`}
              onChange={(event) => updateSkill(skill.id, { level: levelFor(Number(event.target.value)) })}
              className="mt-3 h-2 w-full cursor-pointer accent-primary-500"
            />
            <div className="mt-1 flex justify-between text-[10px] text-dark-500">
              <span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>
        ))}
        {data.skills.length === 0 && (
          <p className="text-sm text-dark-400 italic w-full text-center py-4">
            No skills added yet. Type a skill above and press Enter.
          </p>
        )}
      </div>
    </div>
  )
}
