'use client'

import { useResumeStore } from '@/store/useResumeStore'
import { TEMPLATES } from '@/lib/constants'
import { Modal } from '@/components/ui'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data, setTemplate } = useResumeStore()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Settings"
      description="Customize the look and feel of your resume."
      size="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <section>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Choose Template</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => {
              const isActive = data.style.templateId === template.id
              return (
                <button
                  type="button"
                  key={template.id}
                  aria-pressed={isActive}
                  onClick={() => setTemplate(template.id)}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-700 bg-surface-elevated hover:border-dark-500 hover:bg-dark-700'
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 shadow-glow"
                    />
                  )}
                  <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: template.secondary }}>
                    <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: template.accent }} />
                  </span>
                  <span className={`font-semibold ${isActive ? 'text-primary-400' : 'text-white'}`}>
                    {template.name}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </Modal>
  )
}
