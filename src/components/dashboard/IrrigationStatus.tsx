import { CheckCircle2, Droplets, Leaf, ShieldCheck } from 'lucide-react'
import type { SensorData } from '@/types/irrigation'
import { StatusBadge } from '@/components/common/StatusBadge'

interface IrrigationStatusProps {
  sensorData: SensorData
}

export function IrrigationStatus({ sensorData }: IrrigationStatusProps) {
  const isDry = sensorData.soilMoisturePercent < 40
  const waterLow = sensorData.waterRawValue < 800
  const pumpOn = sensorData.pumpStatus === 'on'
  const reason = pumpOn
    ? 'Soil is dry, no rain detected, and water is available.'
    : isDry && sensorData.isRaining
      ? 'Rain detected, so irrigation is paused.'
      : isDry && waterLow
        ? 'Water level is low, so irrigation is paused.'
        : 'Soil moisture is sufficient.'

  return (
    <section className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold"><Droplets className="size-4 text-primary" />Irrigation status</p>
          <p className="mt-1 text-xs text-muted-foreground">Current automatic watering state</p>
        </div>
        <StatusBadge tone={pumpOn ? 'success' : 'neutral'}>{pumpOn ? 'Pump ON' : 'Pump OFF'}</StatusBadge>
      </div>
      <div className="mt-5 flex items-center gap-4 rounded-xl bg-secondary/60 p-4">
        <div className={pumpOn ? 'flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'flex size-12 items-center justify-center rounded-xl bg-secondary text-primary'}>
          {pumpOn ? <Droplets className="size-6" /> : <Leaf className="size-6" />}
        </div>
        <div>
          <p className="font-display text-lg font-bold">{pumpOn ? 'Irrigation active' : 'Irrigation on standby'}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{reason}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: 'Soil', value: isDry ? 'Dry' : 'Optimal', good: !isDry },
          { label: 'Rain', value: sensorData.isRaining ? 'Detected' : 'Clear', good: !sensorData.isRaining },
          { label: 'Water', value: waterLow ? 'Low' : 'Available', good: !waterLow },
        ].map(({ label, value, good }) => (
          <div key={label} className="rounded-lg border bg-card px-2 py-2.5 text-center">
            <CheckCircle2 className={`mx-auto size-4 ${good ? 'text-emerald-500' : 'text-amber-500'}`} />
            <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
            <p className="text-xs font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t pt-4 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />Decision state is reported by the device data layer
      </div>
    </section>
  )
}
