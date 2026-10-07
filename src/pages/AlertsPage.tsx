import { AlertCircle, Bell, CheckCircle2, Info, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useDashboardData } from '@/hooks/useDashboardData'
import type { AlertSeverity } from '@/types/irrigation'

const config: Record<AlertSeverity, { label: string; icon: typeof Info; tone: 'info' | 'warning' | 'critical' | 'success' }> = {
  critical: { label: 'Critical', icon: ShieldAlert, tone: 'critical' },
  warning: { label: 'Warning', icon: AlertCircle, tone: 'warning' },
  info: { label: 'Information', icon: Info, tone: 'info' },
  success: { label: 'Success', icon: CheckCircle2, tone: 'success' },
}

export function AlertsPage() {
  const { sensorData, alerts, isLoading } = useDashboardData()
  const [filter, setFilter] = useState<'all' | AlertSeverity>('all')
  if (isLoading || !sensorData) return <AppShell><main className="p-8"><div className="h-64 animate-pulse rounded-2xl bg-secondary" /></main></AppShell>
  const visibleAlerts = filter === 'all' ? alerts : alerts.filter((alert) => alert.severity === filter)
  return <AppShell connectionStatus={sensorData.connectionStatus}><PageHeader title="Alerts" description="Review system events and conditions that need attention." sensorData={sensorData} /><main className="mx-auto max-w-[1100px] space-y-6 p-4 sm:p-6 lg:p-8"><div className="flex items-center gap-2 overflow-x-auto pb-1">{(['all', 'critical', 'warning', 'info', 'success'] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={`interactive-control shrink-0 rounded-xl border px-4 py-2 text-xs font-semibold capitalize ${filter === value ? 'border-primary bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>{value === 'all' ? 'All alerts' : config[value].label}</button>)}</div><section className="dashboard-card divide-y rounded-2xl bg-card shadow-sm shadow-slate-200/40 dark:shadow-black/20">{visibleAlerts.map((alert) => { const item = config[alert.severity]; const Icon = item.icon; return <article key={alert.id} className="flex gap-4 p-5"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-bold">{alert.title}</h2><div className="flex items-center gap-2"><StatusBadge tone={item.tone}>{item.label}</StatusBadge><time className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time></div></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{alert.message}</p><p className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-300"><Bell className="size-3.5" />Status: acknowledged by monitoring view</p></div></article> })}</section>{visibleAlerts.length === 0 && <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">No alerts match this filter.</div>}</main></AppShell>
}
