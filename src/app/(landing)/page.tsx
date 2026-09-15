import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_TITLE, pageMetadata } from '@/lib/site'
import { Hero } from '@/components/landing/Hero'
import { TemplateSpotlight } from '@/components/landing/TemplateSpotlight'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTA } from '@/components/landing/CTA'

export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: '/',
})

export default async function HomePage() {
  
  return (
    <>
      <Hero />
      <TemplateSpotlight />
      <HowItWorks />
      <Features />
      <CTA />
    </>
  )
}
