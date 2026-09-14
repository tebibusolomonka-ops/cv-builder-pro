import Link from 'next/link'
import { FileText } from 'lucide-react'

const PRODUCT = [
  { label: 'Templates', href: '/templates' },
  { label: 'CV Builder', href: '/resume/1/edit' },
  { label: 'Your Workspace', href: '/dashboard' },
]

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
]

export function Footer() {
  return (
    <footer className="landing-footer relative border-t border-dark-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500">
                <FileText className="h-5 w-5 text-dark-100" />
              </span>
              <span className="text-lg font-bold text-dark-100">
                Netsa <span className="text-primary-400">CV</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-dark-400">
              A free CV builder that keeps your information on your own device. No account, no
              payment, no mark on your PDF.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-dark-400">
              Product
            </h3>
            <ul className="space-y-2.5">
              {PRODUCT.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-dark-300 transition-colors hover:text-primary-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-dark-400">
              Your data
            </h3>
            <p className="text-sm leading-relaxed text-dark-400">
              Everything you type is saved in this browser only. If you clear your browser data,
              your CV is gone. We do not keep a copy.
            </p>
            <ul className="mt-5 space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-dark-300 transition-colors hover:text-primary-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-dark-800 pt-8 text-center">
          <p className="text-sm text-dark-400">
            © {new Date().getFullYear()} Netsa CV
          </p>
        </div>
      </div>
    </footer>
  )
}
