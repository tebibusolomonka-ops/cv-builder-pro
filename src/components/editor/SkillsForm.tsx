'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { Input, Button } from '@/components/ui'
import { Plus, X } from 'lucide-react'

export function SkillsForm() {
  const { data, addSkill, removeSkill } = useResumeStore()
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    addSkill({
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      level: 'intermediate',
    })
    setNewSkill('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <div className="flex-1">
          <Input
            name="skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. React.js, Project Management..."
          />
        </div>
        <Button type="submit" variant="gradient" className="shrink-0 pt-[2px]">
          <Plus size={18} />
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 pt-2">
        {data.skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-elevated border border-dark-600 rounded-lg text-sm text-white group"
          >
            <span>{skill.name}</span>
            <button
              onClick={() => removeSkill(skill.id)}
              className="text-dark-400 hover:text-error-text transition-colors"
            >
              <X size={14} />
            </button>
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
