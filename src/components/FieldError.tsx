import { cn } from '../lib/utils'

interface FieldErrorProps {
  message?: string
  className?: string
}

export default function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null
  return (
    <p
      className={cn(
        'text-sm font-medium text-destructive -mt-3 mb-4 leading-snug',
        className
      )}
      role="alert"
    >
      {message}
    </p>
  )
}
