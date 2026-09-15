import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'
import { TemplateShowcase } from '@/components/landing/TemplateShowcase'

export const metadata: Metadata = pageMetadata({
  title: 'CV Templates — Netsa CV',
  description:
    'Browse every free CV template on Netsa CV. Each one is a different layout, and you can edit any of them and download it as a PDF.',
  path: '/templates',
})

export default function TemplatesPage() {
  return (
    <div className="pt-28">
      <TemplateShowcase />
    </div>
  )
}
