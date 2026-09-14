import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

// Relative URLs in metadata (Open Graph images, canonicals) resolve against
// this. Without it Next warns and falls back to localhost, which then ships
// localhost URLs into the production page head.
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://netsacv.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Netsa CV — Free CV and Resume Builder',
  description:
    'Netsa CV is a free CV builder. Choose a design, add your details, and download a PDF. No account, no payment, and your information stays on your device.',
  keywords: [
    'resume builder',
    'cv builder',
    'resume maker',
    'cv maker',
    'free resume',
    'professional resume',
    'ATS resume',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Netsa CV — Free CV and Resume Builder',
    description: 'Build your CV for free and download it as a PDF. No account needed, and nothing leaves your device.',
    type: 'website',
    siteName: 'Netsa CV',
    url: SITE_URL,
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
