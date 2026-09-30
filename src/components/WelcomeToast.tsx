'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

const WELCOME_SHOWN_KEY = 'netsa-cv:welcome-shown:2026-09-30'
const WELCOME_DELAY_MS = 8_000

export function WelcomeToast() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem(WELCOME_SHOWN_KEY)) return
    } catch {
      // Storage can be unavailable in strict privacy modes. The toast may still
      // be shown for this page load, but it must never block the application.
    }

    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(WELCOME_SHOWN_KEY, 'true')
      } catch {
        // The welcome message remains useful even when persistence is blocked.
      }

      toast('Welcome to Netsa CV! Create a professional CV for free — no account, no watermark.', {
        icon: '👋',
        duration: 6_000,
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      })
    }, WELCOME_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [])

  return null
}
