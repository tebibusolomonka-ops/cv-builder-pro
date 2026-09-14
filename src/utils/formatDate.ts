import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns'

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Invalid date'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDate(date: Date | string, formatStr: string = 'MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return format(d, formatStr)
}

export function formatFullDate(date: Date | string): string {
  return formatDate(date, 'MMMM d, yyyy')
}
