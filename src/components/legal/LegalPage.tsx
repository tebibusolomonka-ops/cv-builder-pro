import Link from 'next/link'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="pt-32 pb-24">
      <article className="mx-auto w-full max-w-2xl px-6">
        <header className="mb-12 border-b border-dark-800 pb-8">
          <h1 className="text-4xl font-bold tracking-tight text-dark-100 md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-dark-400">Last updated {updated}</p>
        </header>

        <div className="space-y-10">{children}</div>

        <footer className="mt-16 border-t border-dark-800 pt-8">
          <p className="text-sm leading-relaxed text-dark-400">
            This page is written in plain language and describes how the site actually behaves. It
            has not been reviewed by a lawyer. If you rely on this service in a professional or
            commercial context, seek your own advice.
          </p>
          <div className="mt-6 flex gap-6 text-sm">
            <Link href="/privacy" className="text-dark-400 transition-colors hover:text-primary-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-dark-400 transition-colors hover:text-primary-400">
              Terms of Use
            </Link>
            <Link href="/" className="text-dark-400 transition-colors hover:text-primary-400">
              Back to site
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-dark-100">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-dark-300">{children}</div>
    </section>
  )
}
