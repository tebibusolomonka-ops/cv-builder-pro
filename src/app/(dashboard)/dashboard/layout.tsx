import type { Metadata } from 'next'

/**
 * Exists only to carry metadata. This is a personal workspace backed by
 * browser storage, so it has nothing to show a search engine and must not be
 * indexed.
 *
 * The screen itself is a Client Component, and a Client Component cannot
 * export metadata, so the noindex has to live in a server layout wrapped
 * around it. This one adds no markup.
 */
export const metadata: Metadata = {
  title: 'Your Workspace — Netsa CV',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
