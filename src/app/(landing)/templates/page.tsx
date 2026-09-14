import type { Metadata } from 'next'
import { TemplateShowcase } from '@/components/landing/TemplateShowcase'

export const metadata: Metadata = {
  title: 'CV Templates — Netsa CV',
  description:
    'See every CV design. Each one is a different layout, all of them are free, and you can change any of them.',
}

export default function TemplatesPage() {
  return (
    <div className="pt-28">
      <TemplateShowcase />
    </div>
  )
}
