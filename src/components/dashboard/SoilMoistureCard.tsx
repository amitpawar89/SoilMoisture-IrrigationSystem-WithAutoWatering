import { Droplets, Gauge } from 'lucide-react'
import type { SensorData } from '@/types/irrigation'
import { StatusBadge } from '@/components/common/StatusBadge'

interface SoilMoistureCardProps {
  sensorData: SensorData
}

export function SoilMoistureCard({ sensorData }: SoilMoistureCardProps) {
  const isDry = sensorData.soilMoisturePercent < 40
  const status = isDry ? 'Dry' : 'Optimal'
  const tone = isDry ? 'warning' : 'success'

  return (
    <article className="dashboard-card min-w-0 rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20 lg:row-span-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold"><Droplets className="size-4 text-primary" />Soil moisture</p>
          <p className="mt-1 text-xs text-muted-foreground">Live reading from capacitive sensor</p>
        </div>
        <StatusBadge tone={tone}>{status}</StatusBadge>
      </div>
      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative size-36 shrink-0">
          <svg className="size-full -rotate-90" viewBox="0 0 120 120" aria-label={`${sensorData.soilMoisturePercent}% soil moisture`}>
            <circle cx="60" cy="60" r="49" fill="none" stroke="var(--color-border)" strokeWidth="10" />
            <circle cx="60" cy="60" r="49" fill="none" stroke={isDry ? 'var(--color-chart-secondary)' : 'var(--color-chart-primary)'} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${sensorData.soilMoisturePercent * 3.08} 308`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold">{sensorData.soilMoisturePercent}%</span>
            <span className="text-[10px] text-muted-foreground">moisture</span>
          </div>
        </div>
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Irrigation threshold</p>
            <p className="mt-1 text-sm font-semibold text-foreground">Dry below <span className="text-primary">40%</span></p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Raw sensor value</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><Gauge className="size-3.5 text-muted-foreground" />{sensorData.soilRawValue} ADC</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Irrigation threshold</span><span className="font-semibold text-primary">Dry below 40%</span>
      </div>
    </article>
  )
}
