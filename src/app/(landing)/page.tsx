import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_TITLE, pageMetadata } from '@/lib/site'
import { homepageStructuredData, jsonLd } from '@/lib/structuredData'
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
      {/*
        The site's only WebSite/Organization markup. Keeping it on the homepage
        alone is what guarantees a single, unambiguous entity -- the same graph
        repeated on /templates and the legal pages would give search engines
        several copies to reconcile.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homepageStructuredData) }}
      />

      <Hero />
      <TemplateSpotlight />
      <HowItWorks />
      <Features />
      <CTA />
    </>
  )
}
