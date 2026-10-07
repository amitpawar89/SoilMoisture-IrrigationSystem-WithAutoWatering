import { CloudRain, Droplets, Gauge, ShieldAlert } from 'lucide-react'
import type { SensorData } from '@/types/irrigation'
import { StatusBadge } from '@/components/common/StatusBadge'

interface WaterRainPanelProps {
  sensorData: SensorData
}

export function WaterRainPanel({ sensorData }: WaterRainPanelProps) {
  const waterLow = sensorData.waterRawValue < 800
  return (
    <section className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
      <div className="mb-5">
        <p className="text-sm font-bold">Water & rain conditions</p>
        <p className="mt-1 text-xs text-muted-foreground">Protection signals for automatic irrigation</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-4 dark:border-blue-900/70 dark:bg-blue-950/30">
          <div className="flex items-start justify-between">
            <div className="flex size-9 items-center justify-center rounded-lg bg-card text-blue-600"><Droplets className="size-4" /></div>
            <StatusBadge tone={waterLow ? 'critical' : 'success'}>{waterLow ? 'Low' : 'Sufficient'}</StatusBadge>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Tank level <span className="text-[10px]">(mock display)</span></p>
          <p className="mt-1 font-display text-2xl font-bold">{sensorData.waterLevelPercent == null ? 'Available' : `${sensorData.waterLevelPercent}%`}</p>
          {sensorData.waterLevelPercent != null && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950/70"><div className="h-full rounded-full bg-blue-500 dark:bg-blue-400" style={{ width: `${sensorData.waterLevelPercent}%` }} /></div>}
          <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground"><Gauge className="size-3" />Raw value {sensorData.waterRawValue} · Low below 800</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-900/45">
          <div className="flex items-start justify-between">
            <div className="flex size-9 items-center justify-center rounded-lg bg-card text-slate-600 dark:text-slate-300"><CloudRain className="size-4" /></div>
            <StatusBadge tone={sensorData.isRaining ? 'info' : 'neutral'}>{sensorData.isRaining ? 'Detected' : 'No rain'}</StatusBadge>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Rain detection</p>
          <p className="mt-1 font-display text-2xl font-bold">{sensorData.isRaining ? 'Rain detected' : 'Clear skies'}</p>
          <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground"><ShieldAlert className="size-3" />Sensor value {sensorData.rainRawValue} · Detect below 2000</p>
        </div>
      </div>
    </section>
  )
}
