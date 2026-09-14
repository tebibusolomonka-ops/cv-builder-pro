'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import {
  FileText,
  LayoutDashboard,
  FilePlus,
  Briefcase,
  Settings,
  Bell,
  Search,
} from 'lucide-react'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useResumeStore } from '@/store/useResumeStore'
import { useUIStore } from '@/store/useUIStore'
import { STARRED_RESUME_KEY } from '@/lib/constants'
import { Dropdown } from '@/components/ui'

const navLinks = [
  { label: 'Workspace', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Current Resume', href: '/resume/1/edit', icon: FileText },
  { label: 'New Resume', href: '/resume/new', icon: FilePlus },
  { label: 'Applications', href: '/applications', icon: Briefcase },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore()
  const { resumeSearchQuery, setResumeSearchQuery } = useUIStore()

  return (
    <div className="app-shell min-h-screen">
      <header className="sticky top-0 z-40 border-b border-dark-700/50 glass-strong">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-indigo">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-heading text-lg font-bold text-dark-100 sm:block">
              CV Builder <span className="text-primary-400">Pro</span>
            </span>
          </Link>

          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              if (link.label === 'New Resume') {
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      useResumeStore.getState().resetResume()
                      setResumeSearchQuery('')
                      window.localStorage.removeItem(STARRED_RESUME_KEY)
                      window.location.href = '/resume/1/edit'
                    }}
                    className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-dark-400 transition-all duration-200 hover:bg-dark-800 hover:text-white"
                  >
                    <link.icon size={17} className="shrink-0" />
                    <span className="hidden lg:block">{link.label}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-600/10 text-primary-400'
                      : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                  )}
                >
                  <link.icon size={17} className="shrink-0" />
                  <span className="hidden lg:block">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {pathname === '/dashboard' && (
              <div className="group hidden items-center gap-2 rounded-xl border border-dark-500/80 bg-surface-elevated/80 px-3 py-2 shadow-inner shadow-black/20 transition-[background-color,border-color,box-shadow] focus-within:border-primary-400 focus-within:bg-surface-elevated focus-within:ring-2 focus-within:ring-primary-500/25 md:flex">
                <Search size={15} className="text-dark-400 transition-colors group-focus-within:text-primary-400" aria-hidden="true" />
                <input
                  type="search"
                  value={resumeSearchQuery}
                  onChange={(event) => setResumeSearchQuery(event.target.value)}
                  aria-label="Search resumes"
                  placeholder="Search resumes..."
                  className="w-36 border-none bg-transparent text-sm text-dark-200 outline-none placeholder:text-dark-400"
                />
              </div>
            )}

            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
                  className="relative rounded-lg p-2 text-dark-400 transition-all hover:bg-dark-800 hover:text-white"
                >
                  <Bell size={19} aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-700 text-[10px] font-bold text-white"
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              }
              items={
                notifications.length > 0
                  ? [
                      ...notifications.slice(0, 3).map(n => ({
                        label: n.title,
                        value: n.id,
                        onClick: markAllAsRead,
                      })),
                      { label: 'Clear all notifications', value: 'clear', danger: true, divider: true, onClick: markAllAsRead }
                    ]
                  : [{ label: 'No new notifications', value: 'empty' }]
              }
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}
