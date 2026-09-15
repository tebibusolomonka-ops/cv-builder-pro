import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  // Relative URLs in metadata (the Open Graph image, canonicals) resolve
  // against this. Without it Next falls back to localhost and ships localhost
  // URLs into the production page head.
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'resume builder',
    'cv builder',
    'resume maker',
    'cv maker',
    'free resume',
    'professional resume',
    'ATS resume',
  ],
  // No `alternates` here on purpose. Metadata is inherited, so a canonical
  // set on the root layout is handed down to every page that does not override
  // it -- which had /templates, /privacy and /terms all naming the homepage as
  // their canonical URL, telling Google not to index any of them. Each public
  // page states its own through pageMetadata() instead.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: 'en_US',
    // No `images` key: src/app/opengraph-image.png is picked up by Next's
    // file convention and given an absolute URL automatically. This block is
    // only the fallback for the private screens; public pages set their own.
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: '!bg-dark-800 !text-dark-100 !border !border-dark-600 !shadow-xl',
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  )
}
