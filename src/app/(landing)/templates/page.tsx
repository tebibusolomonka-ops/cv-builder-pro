import type { Metadata } from 'next'
import { TemplateShowcase } from '@/components/landing/TemplateShowcase'

export const metadata: Metadata = {
  title: 'Resume Templates — CV Builder Pro',
  description:
    'Browse every resume layout in the collection. Each one is a distinct design, rendered live, free to use and fully editable.',
}

export default function TemplatesPage() {
  return (
    <div className="pt-28">
      <TemplateShowcase />
    </div>
  )
}
