import { Hero } from '@/components/landing/Hero'
import { TemplateSpotlight } from '@/components/landing/TemplateSpotlight'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTA } from '@/components/landing/CTA'

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
