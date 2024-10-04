'use client'

import { InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { motion, useAnimationControls } from 'framer-motion'
import { LucideEye, LucideEyeOff } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'

// Zod schema for password validation, now including uppercase letter check
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[\W_]/, 'Password must contain at least one special character')

const PasswordStrength = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, onChange, placeholder, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>(
      typeof value === 'string' ? value : '',
    )
    const [validationError, setValidationError] = useState<string | null>(null)
    const [validationProgress, setValidationProgress] = useState(0)
    const [hasScaled, setHasScaled] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const scaleControls = useAnimationControls()

    const getBackgroundColor = (progress: number) => {
      if (progress === 0) return '#ffcccb'
      if (progress < 100) return '#ffa07a'
      return '#32cd32'
    }

    useEffect(() => {
      const checks = {
        length: false,
        letter: false,
        uppercase: false,
        number: false,
        special: false,
      }

      if (inputValue.length >= 8) checks.length = true
      if (/[a-zA-Z]/.test(inputValue)) checks.letter = true
      if (/[A-Z]/.test(inputValue)) checks.uppercase = true
      if (/\d/.test(inputValue)) checks.number = true
      if (/[\W_]/.test(inputValue)) checks.special = true

      const progress =
        (Object.values(checks).filter((pass) => pass).length / 5) * 100
      setValidationProgress(progress)

      try {
        passwordSchema.parse(inputValue)
        setValidationError(null)
      } catch (err: any) {
        setValidationError(err.errors[0].message)
      }

      if (progress === 100 && !hasScaled) {
        scaleControls.start({
          scale: [1, 0.9, 1.1, 1],
          transition: { duration: 0.5 },
        })
        setHasScaled(true)
      }
    }, [inputValue, scaleControls, hasScaled])

    return (
      <div className="h-full w-full center">
        <motion.div
          layout
          transition={{ duration: 0.1, ease: 'easeInOut' }}
          className="max-w-lg mx-auto w-full center flex-col gap-4"
        >
          <motion.div
            animate={scaleControls}
            className="w-full h-auto rounded-md bg-muted p-1 relative z-0 overflow-hidden"
          >
            <div className="h-full m-auto w-full bg-background rounded-md overflow-hidden">
              <input
                ref={ref}
                {...props}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  onChange?.(e) // Ensure form state is updated
                  if (validationProgress < 100) setHasScaled(false)
                }}
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
                className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center justify-center border rounded"
                onClick={() => setShowPassword((prev) => !prev)} // Toggle showPassword state
              >
                {showPassword ? (
                  <LucideEye className="size-3 cursor-pointer text-muted-foreground" />
                ) : (
                  <LucideEyeOff className="size-3 cursor-pointer text-muted-foreground" />
                )}
              </button>
              <motion.div
                style={{
                  background: getBackgroundColor(validationProgress),
                }}
                animate={{ width: `${validationProgress}%` }}
                className={cn(`absolute top-0 left-0 h-full -z-10`)}
              />
            </div>
          </motion.div>
          {validationError && inputValue.length !== 0 && (
            <p className="text-destructive text-sm mt-2">{validationError}</p>
          )}
        </motion.div>
      </div>
    )
  },
)

export default PasswordStrength
