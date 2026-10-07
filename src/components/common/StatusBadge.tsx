import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeTone = 'success' | 'warning' | 'critical' | 'info' | 'neutral'

interface StatusBadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
  dot?: boolean
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800',
  critical: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800',
  info: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-800',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
}

const dotClasses: Record<BadgeTone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
}

export function StatusBadge({ children, tone = 'neutral', className, dot = true }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', toneClasses[tone], className)}>
      {dot && <span className={cn('size-1.5 rounded-full', dotClasses[tone])} />}
      {children}
    </span>
  )
}
