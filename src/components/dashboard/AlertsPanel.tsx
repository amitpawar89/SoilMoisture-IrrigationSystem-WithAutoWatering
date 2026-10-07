import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import type { AlertSeverity, SystemAlert } from '@/types/irrigation'

interface AlertsPanelProps {
  alerts: SystemAlert[]
}

const severityConfig: Record<AlertSeverity, { icon: typeof Info; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
  info: { icon: Info, color: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50' },
  warning: { icon: AlertCircle, color: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/50' },
  critical: { icon: AlertCircle, color: 'text-red-600 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-950/50' },
}

interface AlertRowProps {
  alert: SystemAlert
}

function AlertRow({ alert }: AlertRowProps) {
  const { icon: Icon, color, bg } = severityConfig[alert.severity]
  return (
    <div className="flex gap-3">
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}><Icon className="size-4" /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold">{alert.title}</p>
          <time className="shrink-0 text-[10px] text-muted-foreground">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
        </div>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{alert.message}</p>
      </div>
    </div>
  )
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <section className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
      <div className="mb-5 flex items-center justify-between">
        <div><p className="text-sm font-bold">System alerts</p><p className="mt-1 text-xs text-muted-foreground">Updates that need your attention</p></div>
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-primary">{alerts.length} updates</span>
      </div>
      <div className="space-y-4">{alerts.map((alert) => <AlertRow key={alert.id} alert={alert} />)}</div>
    </section>
  )
}
