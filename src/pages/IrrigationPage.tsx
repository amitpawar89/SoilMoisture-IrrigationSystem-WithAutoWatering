import { Activity, CheckCircle2, Clock3, Droplets } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/common/PageHeader'
import { IrrigationStatus } from '@/components/dashboard/IrrigationStatus'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { useSensorData } from '@/hooks/useSensorData'
import type { ActivityEvent } from '@/types/irrigation'
import { appendLiveHistory } from '@/services/liveAnalyticsHistory'
import { useEffect, useMemo } from 'react'

export function IrrigationPage() {
  const { data, loading, error, lastUpdated } = useSensorData()
  const sensorData = data ? {
    soilMoisturePercent: data.soilPercent, soilRawValue: data.soilRaw, temperatureCelsius: data.temperature,
    humidityPercent: data.humidity, isRaining: data.isRaining, rainRawValue: data.rainRaw, waterLevelPercent: null,
    waterRawValue: data.waterRaw, pumpStatus: data.pumpRunning ? 'on' as const : 'off' as const,
    connectionStatus: error || !data.esp32Online ? 'offline' as const : 'online' as const,
    timestamp: (lastUpdated ?? new Date()).toISOString(), dataSource: 'live' as const,
  } : null
  useEffect(() => { if (data && lastUpdated) appendLiveHistory(data, lastUpdated) }, [data, lastUpdated])
  const activity = useMemo<ActivityEvent[]>(() => {
    if (!data || !lastUpdated) return []
    const timestamp = lastUpdated.toISOString()
    return [
      { id: 'live-connection', type: 'connection', title: data.esp32Online ? 'ESP32 connected' : 'ESP32 offline', description: data.esp32Online ? 'Device is online and sending sensor readings.' : 'The device is not currently reachable.', timestamp },
      { id: 'live-soil', type: 'sensor', title: 'Soil moisture checked', description: `Moisture level measured at ${data.soilPercent}%.`, timestamp },
      { id: 'live-pump', type: 'pump', title: data.pumpRunning ? 'Pump is running' : 'Pump remains off', description: data.pumpRunning ? 'The ESP32 reports that irrigation is active.' : 'The ESP32 reports that irrigation is inactive.', timestamp },
      { id: 'live-water', type: 'alert', title: data.waterLow ? 'Water level low' : 'Water level available', description: `Water sensor reading: ${data.waterRaw} ADC.`, timestamp },
    ]
  }, [data, lastUpdated])
  if (loading || !sensorData) return <AppShell><main className="p-8"><div className="h-64 animate-pulse rounded-2xl bg-secondary" /></main></AppShell>
  return <AppShell connectionStatus={sensorData.connectionStatus}>
    <PageHeader title="Irrigation" description="Understand the device-reported watering decision without changing its logic." sensorData={sensorData} />
    <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><IrrigationStatus sensorData={sensorData} /><section className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20"><div className="flex items-center gap-2"><Activity className="size-4 text-primary" /><h2 className="text-sm font-bold">Decision flow</h2></div><div className="mt-5 space-y-3">{[['Soil condition', sensorData.soilMoisturePercent < 40 ? 'Dry' : 'Optimal', sensorData.soilMoisturePercent < 40], ['Rain condition', sensorData.isRaining ? 'Detected' : 'Clear', sensorData.isRaining], ['Water availability', sensorData.waterRawValue < 800 ? 'Low' : 'Available', sensorData.waterRawValue < 800]].map(([label, value, attention]) => <div key={String(label)} className="flex items-center justify-between rounded-xl border bg-secondary/30 p-3 text-sm"><span className="text-muted-foreground">{label}</span><span className="flex items-center gap-2 font-semibold">{String(value)}<CheckCircle2 className={`size-4 ${attention ? 'text-amber-500' : 'text-emerald-500'}`} /></span></div>)}</div><div className="mt-5 border-t pt-4 text-xs leading-5 text-muted-foreground"><Droplets className="mr-1 inline size-3.5 text-primary" />Pump control is read-only until the ESP32 integration phase.</div></section></div>
      <section><div className="mb-4 flex items-center gap-2"><Clock3 className="size-4 text-primary" /><h2 className="text-lg font-bold">Recent irrigation activity</h2></div><RecentActivity activity={activity} /></section>
    </main>
  </AppShell>
}
