'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui/Modal'
import { Eye, Plus } from 'lucide-react'
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  LAYOUT_LABELS,
  SHOWCASE_VARIANT,
  type TemplateDefinition,
  type TemplateLayoutId,
} from '@/lib/constants'
import { TemplateThumbnail } from '@/components/editor/TemplateThumbnail'
import { useResumeStore } from '@/store/useResumeStore'

type TemplateCategoryId = (typeof TEMPLATE_CATEGORIES)[number]['id']

interface LayoutGroup {
  layout: TemplateLayoutId
  category: TemplateDefinition['category']
  name: string
  description: string
  showcaseId: string
}

function groupByLayout(templates: TemplateDefinition[]): LayoutGroup[] {
  const groups = new Map<TemplateLayoutId, LayoutGroup>()
  for (const t of templates) {
    if (groups.has(t.baseTemplate)) continue
    const preferred = SHOWCASE_VARIANT[t.baseTemplate]
    groups.set(t.baseTemplate, {
      layout: t.baseTemplate,
      category: t.category,
      name: LAYOUT_LABELS[t.baseTemplate],
      description: t.description,
      showcaseId: templates.some((x) => x.id === preferred) ? preferred : t.id,
    })
  }
  return [...groups.values()]
}

export function TemplateShowcase() {
  const router = useRouter()
  const { resetResume, setTemplate } = useResumeStore()
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryId>('all')
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  const groups = useMemo(() => groupByLayout(TEMPLATES), [])
  const visibleGroups =
    activeCategory === 'all' ? groups : groups.filter((g) => g.category === activeCategory)

  const handleUseTemplate = (templateId: string) => {
    resetResume()
    setTemplate(templateId)
    router.push(`/resume/new/edit?template=${encodeURIComponent(templateId)}`)
  }

  const selectedTemplateDetails = TEMPLATES.find((t) => t.id === previewTemplate)

  return (
    <section className="landing-section landing-template-section scroll-mt-24" id="templates">
      <div className="landing-section-inner">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display mb-5 text-4xl font-bold tracking-tight text-dark-100 md:text-5xl"
          >
            Every layout in <span className="text-primary-400">the collection</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg leading-relaxed text-dark-300"
          >
            Each one is a distinct design, shown in its strongest colourway and rendered live —
            what you see is what you get. Recolour anything once you are in the editor.
          </motion.p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-dark-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleGroups.map((group) => {
            const activeId = group.showcaseId
            return (
              <motion.div
                key={group.layout}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4 }}
                className="group overflow-hidden rounded-2xl border border-dark-800 bg-surface-elevated transition-colors duration-300 hover:border-primary-500/40"
                style={{ contentVisibility: 'auto', containIntrinsicSize: '640px' }}
              >
                <div className="relative aspect-[1/1.4142] overflow-hidden bg-white">
                  <TemplateThumbnail key={activeId} templateId={activeId} />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-dark-950/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => handleUseTemplate(activeId)}>
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      className="border-dark-300 text-dark-100 hover:bg-dark-100 hover:text-dark-950"
                      leftIcon={<Eye size={16} />}
                      onClick={() => setPreviewTemplate(activeId)}
                    >
                      Preview
                    </Button>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-dark-100">{group.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-dark-400">
                    {group.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <Modal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        ariaLabel="Template preview"
        title={selectedTemplateDetails?.name}
        description={selectedTemplateDetails?.description}
        size="lg"
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-6 aspect-[1/1.4142] w-full overflow-hidden rounded-lg bg-white">
            {previewTemplate && <TemplateThumbnail templateId={previewTemplate} eager />}
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full text-lg"
            onClick={() => {
              if (previewTemplate) handleUseTemplate(previewTemplate)
            }}
          >
            Use This Template
          </Button>
        </div>
      </Modal>
    </section>
  )
}
