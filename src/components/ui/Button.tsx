'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-primary-600 hover:bg-primary-500 text-white font-semibold shadow-lg shadow-primary-900/40 hover:shadow-primary-800/50 active:scale-[0.98]',
      secondary:
        'bg-dark-800 hover:bg-dark-700 text-dark-100 border border-dark-500 hover:border-dark-400',
      outline:
        'bg-transparent hover:bg-dark-800 text-dark-200 border border-dark-500 hover:border-primary-400 hover:text-primary-300',
      ghost:
        'bg-transparent hover:bg-dark-800 text-dark-300 hover:text-dark-100',
      danger:
        'bg-primary-700 hover:bg-primary-600 text-white shadow-lg shadow-primary-900/40',
      gradient:
        'bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-lg shadow-primary-900/40 hover:shadow-primary-800/50 active:scale-[0.98] hover:brightness-110',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-2.5 text-base rounded-xl gap-2',
      xl: 'px-8 py-3.5 text-lg rounded-xl gap-3',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
