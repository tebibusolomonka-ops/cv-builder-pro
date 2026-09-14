import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'CV Builder Pro — Free Resume Builder',
  description:
    'Create an ATS-friendly resume, choose a professional layout, and export a free PDF without creating an account.',
  keywords: [
    'resume builder',
    'cv builder',
    'resume maker',
    'cv maker',
    'free resume',
    'professional resume',
    'ATS resume',
  ],
  openGraph: {
    title: 'CV Builder Pro — Free Resume Builder',
    description: 'Build an ATS-friendly resume and export it as a free PDF. No account required.',
    type: 'website',
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
