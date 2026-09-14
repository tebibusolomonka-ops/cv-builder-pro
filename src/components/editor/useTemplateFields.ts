'use client'

import { useMemo } from 'react'
import { TEMPLATES, type TemplateLayoutId } from '@/lib/constants'
import {
  LAYOUT_FIELDS,
  LAYOUT_SECTION_ORDER,
  type FormSectionId,
  type ResumeFieldKey,
} from '@/lib/templateFields'
import { useResumeStore } from '@/store/useResumeStore'

const DEFAULT_ORDER: FormSectionId[] = ['summary', 'experience', 'education', 'skills', 'extras']

/**
 * What the chosen template actually prints, so the form can ask for that and
 * nothing else.
 *
 * Only 18 of 51 layouts render a GitHub link and only 13 render projects, but
 * the form used to ask everyone for both -- so people filled in fields that
 * were silently dropped from their CV.
 *
 * The data behind this is generated from the renderer source by
 * scripts/derive-template-fields.mjs; it is not maintained by hand.
 */
export function useTemplateFields() {
  const templateId = useResumeStore((state) => state.data.style.templateId)

  return useMemo(() => {
    const template = TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[0]
    const base = template.baseTemplate as TemplateLayoutId
    const fields = new Set<ResumeFieldKey>(LAYOUT_FIELDS[base] ?? [])
    return {
      base,
      templateName: template.name,
      /** True when this template prints the field. */
      uses: (field: ResumeFieldKey) => fields.has(field),
      /** The order this template reads in, for ordering the form to match. */
      sectionOrder: LAYOUT_SECTION_ORDER[base] ?? DEFAULT_ORDER,
    }
  }, [templateId])
}
