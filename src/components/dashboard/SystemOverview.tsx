import { CheckCircle2, Droplets, ShieldCheck, Sprout } from 'lucide-react'
import { ConnectionStatus } from '@/components/common/ConnectionStatus'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { SensorData } from '@/types/irrigation'

interface SystemOverviewProps {
  sensorData: SensorData
}

export function SystemOverview({ sensorData }: SystemOverviewProps) {
  const soilDry = sensorData.soilMoisturePercent < 40
  const pumpRunning = sensorData.pumpStatus === 'on'

  return (
    <section className="dashboard-card relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm shadow-slate-200/40 dark:shadow-black/20 sm:p-7">
      <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
      <div className="relative grid gap-6 lg:grid-cols-[1.2fr_2fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="size-5" />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">System overview</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">{sensorData.connectionStatus === 'online' ? 'Your field is looking healthy.' : 'System connection needs attention.'}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{sensorData.connectionStatus === 'online' ? 'The monitoring system is online and all connected sensors are reporting normally.' : 'The dashboard cannot currently receive fresh readings from the ESP32.'}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <StatusBadge tone={sensorData.connectionStatus === 'online' ? 'success' : 'critical'}>{sensorData.connectionStatus === 'online' ? 'System normal' : 'Attention required'}</StatusBadge>
            <ConnectionStatus status={sensorData.connectionStatus} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Pump', value: pumpRunning ? 'Running' : 'Standby', icon: Droplets, tone: pumpRunning ? 'bg-emerald-400/20 text-emerald-100' : 'bg-white/10 text-emerald-100' },
            { label: 'Soil', value: soilDry ? 'Needs water' : 'Optimal', icon: Sprout, tone: soilDry ? 'bg-amber-400/20 text-amber-100' : 'bg-white/10 text-emerald-100' },
            { label: 'Water', value: sensorData.waterRawValue < 800 ? 'Low' : 'Sufficient', icon: Droplets, tone: sensorData.waterRawValue < 800 ? 'bg-amber-400/20 text-amber-100' : 'bg-white/10 text-emerald-100' },
            { label: 'Sensors', value: '4 / 4 sensor modules online', icon: CheckCircle2, tone: 'bg-white/10 text-emerald-100' },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className={`rounded-xl border p-3 ${tone.replace('bg-white/10', 'bg-secondary/50').replace('text-emerald-100', 'text-primary').replace('bg-emerald-400/20', 'bg-emerald-500/10').replace('bg-amber-400/20', 'bg-amber-500/10')}`}>
              <Icon className="size-4" />
              <p className="mt-4 text-[11px] text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-sm font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
