import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Skeleton({ className, width, height, rounded = 'md' }: SkeletonProps) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={cn('skeleton', roundedClasses[rounded], className)}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface-elevated rounded-2xl border border-dark-700/50 p-6 space-y-4">
      <Skeleton height={160} rounded="lg" className="w-full" />
      <Skeleton height={20} className="w-3/4" />
      <Skeleton height={16} className="w-1/2" />
      <div className="flex gap-2">
        <Skeleton height={32} width={80} rounded="lg" />
        <Skeleton height={32} width={80} rounded="lg" />
      </div>
    </div>
  )
}
