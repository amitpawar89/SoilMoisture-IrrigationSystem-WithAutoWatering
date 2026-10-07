import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/common/StatusBadge'

interface SensorCardProps {
  label: string
  value: string
  secondary?: string
  status: string
  tone?: 'success' | 'warning' | 'critical' | 'info' | 'neutral'
  icon: LucideIcon
  trend?: 'up' | 'down'
  iconClassName?: string
}

export function SensorCard({ label, value, secondary, status, tone = 'neutral', icon: Icon, trend, iconClassName }: SensorCardProps) {
  return (
    <article className="dashboard-card group min-w-0 rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-transform duration-200 group-hover:scale-105', iconClassName)}>
          <Icon className="size-5 transition-transform duration-200 group-hover:rotate-[-6deg]" />
        </div>
        <StatusBadge tone={tone}>{status}</StatusBadge>
      </div>
      <p className="mt-5 text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="truncate font-display text-2xl font-bold tracking-tight">{value}</p>
        {trend && (trend === 'up' ? <ArrowUpRight className="size-4 text-amber-500" /> : <ArrowDownRight className="size-4 text-primary" />)}
      </div>
      {secondary && <p className="mt-1 truncate text-xs text-muted-foreground">{secondary}</p>}
    </article>
  )
}
