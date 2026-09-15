import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'
import { LegalPage, Section } from '@/components/legal/LegalPage'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy — Netsa CV',
  description:
    'What Netsa CV keeps and does not keep. Your CV stays in your own browser. There are no accounts and no tracking.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="9 August 2026">
      <Section title="The short version">
        <p>
          We do not collect your personal information. There are no accounts, no analytics, and no
          advertising. Your CV is stored in your own browser. If you choose <strong>Export PDF</strong>,
          a temporary copy is sent to the site&rsquo;s PDF renderer and discarded after the download is
          generated.
        </p>
      </Section>

      <Section title="What we store, and where">
        <p>
          Everything you type — your name, contact details, work history, and any photo you upload —
          is saved in your browser&rsquo;s local storage on the device you are using. It stays on
          that device. There is no account database or stored server-side copy.
        </p>
        <p>
          Because it is tied to that browser, clearing your browsing data, using private browsing, or
          switching to another device or browser will mean the CV is no longer there. Use{' '}
          <strong>Backup</strong> in the editor to save a copy you control.
        </p>
      </Section>

      <Section title="Photos">
        <p>
          A profile photo you add is converted to text and stored alongside the rest of your CV in
          the same local storage. Like the other CV fields, it is only transmitted temporarily when
          you explicitly request a server-generated PDF.
        </p>
      </Section>

      <Section title="PDF exports">
        <p>
          Exporting a PDF sends the current browser copy of your CV to this site&rsquo;s own rendering
          endpoint over the same connection used to load the app. It is placed in a short-lived
          browser process solely to create the PDF response. The endpoint does not save the CV to a
          database or file and tells browsers not to cache the response.
        </p>
      </Section>

      <Section title="Third parties">
        <p>
          The site loads its typeface from Google Fonts. That request necessarily tells Google your
          IP address and rough location, as it would on any site using the service. We do not send
          Google anything else, and we receive nothing back about you.
        </p>
        <p>
          There are no analytics tools, no advertising networks, no social media pixels, and no
          cookies used for tracking.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          We do not set tracking cookies. The site uses local storage — a similar browser feature —
          purely to remember your own CV between visits. It is not transmitted during ordinary
          editing; the PDF-export exception is described above.
        </p>
      </Section>

      <Section title="Children">
        <p>
          The site is intended for people old enough to be seeking work. We do not knowingly collect
          information from children, though in practice we do not collect information from anyone.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If this ever changes — for example if accounts or donations are added — this page will be
          updated before the change goes live, and the date at the top will change with it.
        </p>
      </Section>

    </LegalPage>
  )
}
