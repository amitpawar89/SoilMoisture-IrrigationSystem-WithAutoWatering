import { Bell, ChevronDown, CircleDot, RefreshCw, ShieldCheck, Wifi } from 'lucide-react'
import type { SensorData } from '@/types/irrigation'
import { ThemeToggle } from '@/components/common/ThemeToggle'

interface DashboardHeaderProps {
  sensorData: SensorData
}

export function DashboardHeader({ sensorData }: DashboardHeaderProps) {
  const updatedAt = new Date(sensorData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <header className="hidden border-b bg-card/50 px-4 py-4 lg:block lg:px-8">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            <span className="flex size-7 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20"><ShieldCheck className="size-3.5" /></span>
            Operations center
            <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] tracking-[0.12em] text-emerald-600 dark:text-emerald-300">
              <CircleDot className="size-2.5 fill-current" /> LIVE
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
            <span className="hidden rounded-full border bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground sm:inline-flex">FIELD OVERVIEW</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">A focused view of the conditions that matter most.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-3 rounded-2xl border bg-background/70 px-3 py-2.5 shadow-sm xl:flex">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><RefreshCw className="size-3.5" /></span>
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Last update</p><p className="mt-0.5 text-xs font-bold text-foreground">{updatedAt}</p></div>
          </div>
          <div className="hidden items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-300 sm:flex">
            <Wifi className="size-4" /> ESP32 online
          </div>
          <ThemeToggle />
          <button type="button" aria-label="View notifications" className="interactive-control relative rounded-2xl border bg-card p-3 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Bell className="size-[18px]" />
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-amber-500 ring-2 ring-card" />
          </button>
          <button type="button" aria-label="Open account menu" className="interactive-control hidden items-center gap-2 rounded-2xl border bg-card py-2 pl-2 pr-3 text-left sm:flex">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">SI</span>
            <span className="hidden text-xs font-semibold text-foreground xl:block">Field operator</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
