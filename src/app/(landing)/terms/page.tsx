import type { Metadata } from 'next'
import { LegalPage, Section } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Use — Netsa CV',
  description:
    'The terms for using Netsa CV: free to use, provided as-is, and your CV content remains yours.',
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="30 July 2026">
      <Section title="The short version">
        <p>
          The site is free to use. What you write stays yours. It is provided as it is, with no
          promise that it will be perfect or always available, and no promise about the outcome of
          any job application.
        </p>
      </Section>

      <Section title="Using the site">
        <p>
          You may use Netsa CV to create resumes for yourself or for other people, including
          as part of paid work. There is no charge, no subscription, and no watermark on what you
          export.
        </p>
        <p>
          You may not use the site to create documents intended to deceive — for example, resumes
          containing qualifications or employment that never existed — or for anything unlawful.
        </p>
      </Section>

      <Section title="Your content">
        <p>
          Everything you enter belongs to you. We do not claim any rights over it, and since it never
          reaches our servers, we could not use it even if we wanted to.
        </p>
        <p>
          You are responsible for the accuracy of what you write. Employers may verify it.
        </p>
      </Section>

      <Section title="The templates">
        <p>
          The layouts are original designs made for this site. You are free to use them for your own
          resumes and for resumes you produce for others. Please do not repackage the template
          designs themselves as a competing product.
        </p>
      </Section>

      <Section title="Your work can be lost">
        <p>
          This matters more here than on most sites. Your CV is stored only in your browser. Clearing
          your browsing data, using private browsing, reinstalling your browser, or moving to another
          device will lose it.
        </p>
        <p>
          There is no backup on our side and no way for us to recover it. Use{' '}
          <strong>Backup</strong> in the editor to keep a copy. If you lose work without one, it is
          gone.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          The site is provided &ldquo;as is&rdquo;. We do not guarantee it will be free of errors,
          available at any given moment, or that a resume made with it will lead to an interview or a
          job. To the extent the law allows, we are not liable for loss arising from using it,
          including lost work or lost opportunities.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          Features may change or be removed, and these terms may be updated. Significant changes will
          be reflected here with a new date at the top.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If something here is unclear or seems wrong, get in touch using the details on the site.
        </p>
      </Section>
    </LegalPage>
  )
}
