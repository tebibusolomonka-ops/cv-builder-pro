'use client'

import { useEffect } from 'react'
import { useNotificationStore } from '@/store/useNotificationStore'

export const WELCOME_NOTIFICATION_TITLE = 'Welcome to Netsa CV 👋'
export const WELCOME_NOTIFICATION_READ_KEY = 'netsa-cv:welcome-notification-read:v1'
const WELCOME_DELAY_MS = 8_000

export function WelcomeNotification() {
  useEffect(() => {
    try {
      if (window.localStorage.getItem(WELCOME_NOTIFICATION_READ_KEY)) return
    } catch {
      // Storage can be unavailable in strict privacy modes. The in-memory
      // notification still works for the current visit.
    }

    const timer = window.setTimeout(() => {
      const store = useNotificationStore.getState()
      if (store.notifications.some((item) => item.title === WELCOME_NOTIFICATION_TITLE)) return

      store.addNotification({
        type: 'info',
        title: WELCOME_NOTIFICATION_TITLE,
        message: 'Create a professional CV for free — no account, no watermark.',
      })
    }, WELCOME_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [])

  return null
}
