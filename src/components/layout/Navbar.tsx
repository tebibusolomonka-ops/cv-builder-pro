'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui'
import {
  Menu,
  X,
  FileText,
  LayoutDashboard,
  Palette,
} from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Templates', href: '/templates', icon: Palette },
  { label: 'Workspace', href: '/dashboard', icon: LayoutDashboard },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'glass-strong shadow-lg shadow-black/10'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-indigo flex items-center justify-center shadow-lg shadow-primary-600/25 group-hover:shadow-primary-600/40 transition-shadow">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold text-white font-heading">
                  CV Builder
                </span>
                <span className="text-lg font-bold gradient-text font-heading">
                  {' '}Pro
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="gradient" size="sm">
                  Build Your Resume
                </Button>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-navigation"
              className="lg:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {isMobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              id="mobile-navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 glass-strong p-6 pt-20"
            >
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-dark-200 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  >
                    {link.icon && <link.icon size={18} className="text-dark-400" />}
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 space-y-3">
                <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="gradient" fullWidth>
                    Build Your Resume
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
