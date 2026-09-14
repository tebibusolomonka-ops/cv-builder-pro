import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-dark-700 text-dark-300 border-dark-600',
    primary: 'bg-primary-900/50 text-primary-300 border-primary-700/50',
    success: 'bg-success/10 text-dark-100 border-success/30',
    warning: 'bg-warning/10 text-dark-100 border-warning/30',
    danger: 'bg-error/10 text-dark-100 border-error/30',
    info: 'bg-info/10 text-dark-100 border-info/30',
  }

  const dotColors = {
    default: 'bg-dark-400',
    primary: 'bg-primary-400',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-error',
    info: 'bg-info',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}
