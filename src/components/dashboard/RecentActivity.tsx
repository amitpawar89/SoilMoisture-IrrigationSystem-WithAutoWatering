import { Activity, Bell, Droplets, Radio, Sprout } from 'lucide-react'
import type { ActivityEvent, ActivityType } from '@/types/irrigation'

interface RecentActivityProps {
  activity: ActivityEvent[]
}

const activityIcons: Record<ActivityType, typeof Activity> = {
  pump: Droplets,
  sensor: Sprout,
  connection: Radio,
  alert: Bell,
}

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <section className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
      <div className="mb-5 flex items-center justify-between">
        <div><p className="text-sm font-bold">Recent activity</p><p className="mt-1 text-xs text-muted-foreground">Latest events from your system</p></div>
        <Activity className="size-4 text-muted-foreground" />
      </div>
      <div className="space-y-0">
        {activity.map((event, index) => {
          const Icon = activityIcons[event.type]
          return (
            <div key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
              {index !== activity.length - 1 && <span className="absolute left-4 top-8 h-full w-px bg-border" />}
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-secondary text-primary"><Icon className="size-3.5" /></div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold">{event.title}</p><time className="shrink-0 text-[10px] text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{event.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
