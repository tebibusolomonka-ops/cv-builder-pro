'use client'

import { forwardRef, InputHTMLAttributes, useId, useState } from 'react'
import { cn } from '@/utils/cn'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      type,
      id,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const generatedId = useId()
    const isPassword = type === 'password'
    const inputId = id ?? `input-${generatedId.replace(/:/g, '')}`
    const messageId = `${inputId}-${error ? 'error' : 'hint'}`
    const describedBy = [ariaDescribedBy, error || hint ? messageId : undefined]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            aria-describedby={describedBy}
            aria-invalid={ariaInvalid ?? (error ? true : undefined)}
            className={cn(
              'w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-xl text-dark-100 placeholder:text-dark-400',
              'transition-all duration-200',
              'focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/25',
              'hover:border-dark-400',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={messageId} className="flex items-center gap-1.5 text-xs text-error-text">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={messageId} className="text-xs text-dark-400">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
