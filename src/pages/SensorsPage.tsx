import { CloudRain, Droplets, Gauge, Thermometer, Waves } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useDashboardData } from '@/hooks/useDashboardData'

export function SensorsPage() {
  const { sensorData, isLoading } = useDashboardData()
  if (isLoading || !sensorData) return <AppShell><PageLoading /></AppShell>
  const updated = new Date(sensorData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const cards = [
    { title: 'Soil moisture sensor', gpio: 'GPIO34', icon: Droplets, reading: `${sensorData.soilMoisturePercent}%`, raw: `${sensorData.soilRawValue} ADC`, status: sensorData.soilMoisturePercent < 40 ? 'Dry' : 'Optimal', threshold: 'Dry below 40%', tone: sensorData.soilMoisturePercent < 40 ? 'warning' as const : 'success' as const },
    { title: 'DHT22 environmental module', gpio: 'GPIO4', icon: Thermometer, reading: `${sensorData.temperatureCelsius}°C · ${sensorData.humidityPercent}%`, raw: 'Temperature + humidity', status: 'Online', threshold: 'Environmental monitoring', tone: 'info' as const },
    { title: 'Rain sensor', gpio: 'GPIO35', icon: CloudRain, reading: sensorData.isRaining ? 'Rain detected' : 'No rain', raw: `${sensorData.rainRawValue} ADC`, status: sensorData.isRaining ? 'Detected' : 'Clear', threshold: 'Detect below 2000', tone: 'info' as const },
    { title: 'Water level sensor', gpio: 'GPIO36', icon: Gauge, reading: sensorData.waterLevelPercent == null ? 'Available' : `${sensorData.waterLevelPercent}%`, raw: `${sensorData.waterRawValue} ADC`, status: sensorData.waterRawValue < 800 ? 'Low' : 'Sufficient', threshold: 'Low below 800', tone: sensorData.waterRawValue < 800 ? 'critical' as const : 'success' as const },
  ]
  return <AppShell connectionStatus={sensorData.connectionStatus}>
    <PageHeader title="Sensors" description="Detailed health and readings from all four physical sensor modules." sensorData={sensorData} />
    <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map(({ title, gpio, icon: Icon, reading, raw, status, threshold, tone }) => <article key={title} className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
          <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></div><div><h2 className="text-sm font-bold">{title}</h2><p className="text-xs text-muted-foreground">{gpio} · Last update {updated}</p></div></div><StatusBadge tone={tone}>{status}</StatusBadge></div>
          <p className="mt-7 font-display text-3xl font-bold tracking-tight">{reading}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl border bg-secondary/40 p-3"><p className="text-muted-foreground">Current/raw reading</p><p className="mt-1 font-semibold">{raw}</p></div><div className="rounded-xl border bg-secondary/40 p-3"><p className="text-muted-foreground">Threshold</p><p className="mt-1 font-semibold">{threshold}</p></div></div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Waves className="size-3.5 text-primary" />Availability: <span className="font-semibold text-foreground">Available</span></div>
        </article>)}
      </div>
    </main>
  </AppShell>
}

function PageLoading() { return <main className="p-8"><div className="mx-auto max-w-7xl animate-pulse space-y-5"><div className="h-12 w-64 rounded bg-secondary" /><div className="h-52 rounded-2xl bg-secondary" /></div></main> }
