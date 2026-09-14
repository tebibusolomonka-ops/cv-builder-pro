import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  glass?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function Card({
  children,
  className,
  hover = false,
  gradient = false,
  glass = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl transition-all duration-300',
        glass
          ? 'glass'
          : gradient
          ? 'gradient-border'
          : 'bg-surface-elevated border border-dark-700/50',
        hover && 'card-hover cursor-pointer',
        paddings[padding],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
