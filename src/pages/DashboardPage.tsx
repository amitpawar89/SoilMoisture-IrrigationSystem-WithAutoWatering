import { Activity, ArrowUpRight, BarChart3, Bell, CloudSun, Droplets, Gauge, Sprout, Thermometer, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { SensorCard } from '@/components/dashboard/SensorCard'
import { SystemOverview } from '@/components/dashboard/SystemOverview'
import { useSensorData } from '@/hooks/useSensorData'
import type { SensorData as LiveSensorData } from '@/services/esp32Service'
import type { SensorData } from '@/types/irrigation'

function toDashboardSensorData(data: LiveSensorData, connectionStatus: 'online' | 'offline', timestamp: Date | null): SensorData {
  return {
    soilMoisturePercent: data.soilPercent,
    soilRawValue: data.soilRaw,
    temperatureCelsius: data.temperature,
    humidityPercent: data.humidity,
    isRaining: data.isRaining,
    rainRawValue: data.rainRaw,
    waterLevelPercent: null,
    waterRawValue: data.waterRaw,
    pumpStatus: data.pumpRunning ? 'on' : 'off',
    connectionStatus,
    timestamp: (timestamp ?? new Date()).toISOString(),
    dataSource: 'live',
  }
}

export function DashboardPage() {
  const { data, loading, error, lastUpdated, refetch } = useSensorData()
  const sensorData = data ? toDashboardSensorData(data, error || !data.esp32Online ? 'offline' : 'online', lastUpdated) : null
  const liveWaterLow = data?.waterLow ?? false

  if (loading && !sensorData) {
    return <AppShell><main className="p-8"><div className="mx-auto max-w-7xl animate-pulse space-y-5"><div className="h-12 w-64 rounded bg-secondary" /><div className="h-52 rounded-2xl bg-secondary" /><div className="h-64 rounded-2xl bg-secondary" /></div></main></AppShell>
  }

  if (!sensorData) {
    return <AppShell><main className="p-8"><div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"><p className="font-bold">ESP32 unavailable</p><p className="mt-1 text-sm">{error ?? 'No sensor data has been received yet.'}</p><button type="button" onClick={() => void refetch()} className="mt-4 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Retry connection</button></div></main></AppShell>
  }

  return (
    <AppShell connectionStatus={sensorData.connectionStatus}>
      <DashboardHeader sensorData={sensorData} />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:space-y-7 lg:p-8">
        {error && <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200"><span>ESP32 offline. Showing the last valid reading.</span><span className="hidden sm:inline">Polling continues every 5 seconds.</span></div>}
        <SystemOverview sensorData={sensorData} />

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div><h2 className="text-lg font-bold">Critical conditions</h2><p className="mt-1 text-xs text-muted-foreground">The four readings that determine irrigation readiness</p></div>
            <p className="hidden text-xs text-muted-foreground sm:block">Live device data · {lastUpdated ? `updated ${Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 1000))}s ago` : 'waiting for update'}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <SensorCard label="Soil moisture" value={`${sensorData.soilMoisturePercent}%`} status={sensorData.soilMoisturePercent < 40 ? 'Dry' : 'Optimal'} tone={sensorData.soilMoisturePercent < 40 ? 'warning' : 'success'} icon={Droplets} secondary={`${sensorData.soilRawValue} raw value`} />
            <SensorCard label="Water level" value={liveWaterLow ? 'Low' : sensorData.waterLevelPercent == null ? 'Available' : `${sensorData.waterLevelPercent}%`} status={liveWaterLow ? 'Low' : 'Sufficient'} tone={liveWaterLow ? 'critical' : 'success'} icon={Gauge} secondary={`${sensorData.waterRawValue} raw value`} iconClassName="bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300" />
            <SensorCard label="Rain detection" value={sensorData.isRaining ? 'Detected' : 'No rain'} status={sensorData.isRaining ? 'Detected' : 'Clear'} tone={sensorData.isRaining ? 'info' : 'neutral'} icon={CloudSun} secondary={`${sensorData.rainRawValue} sensor value`} iconClassName="bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300" />
            <SensorCard label="Pump status" value={sensorData.pumpStatus === 'on' ? 'ON' : 'OFF'} status={sensorData.pumpStatus === 'on' ? 'Running' : 'Standby'} tone={sensorData.pumpStatus === 'on' ? 'success' : 'neutral'} icon={Sprout} secondary="Automatic control" iconClassName="bg-primary/10 text-primary" />
            <SensorCard label="Temperature" value={`${sensorData.temperatureCelsius}°C`} status="Live" tone="info" icon={Thermometer} secondary="DHT22 reading" iconClassName="bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300" />
            <SensorCard label="Humidity" value={`${sensorData.humidityPercent}%`} status="Live" tone="info" icon={Waves} secondary="DHT22 reading" iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300" />
          </div>
        </section>
        <section className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
          <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-bold">Workspace shortcuts</p><p className="mt-1 text-xs text-muted-foreground">Open a dedicated view when you need more context.</p></div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Quick access</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Sensor health', detail: 'Readings & GPIO status', path: '/sensors', icon: Activity },
              { label: 'Irrigation logic', detail: 'Pump decision details', path: '/irrigation', icon: Droplets },
              { label: 'Historical trends', detail: 'Charts & patterns', path: '/analytics', icon: BarChart3 },
              { label: 'System alerts', detail: 'Warnings & events', path: '/alerts', icon: Bell },
            ].map(({ label, detail, path, icon: Icon }) => (
              <Link key={path} to={path} className="interactive-control group flex items-center gap-3 rounded-xl border bg-background/60 p-3 hover:bg-secondary">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"><Icon className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold">{label}</span><span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{detail}</span></span>
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  )
}
