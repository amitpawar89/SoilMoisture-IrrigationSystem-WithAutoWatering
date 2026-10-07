import { BarChart3 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/common/PageHeader'
import { AnalyticsCharts } from '@/components/charts/AnalyticsCharts'
import { useSensorData } from '@/hooks/useSensorData'
import { appendLiveHistory, loadLiveHistory } from '@/services/liveAnalyticsHistory'
import { useEffect, useMemo, useState } from 'react'

type Range = '24h' | '7d' | '30d'

export function AnalyticsPage() {
  const { data, loading, error, lastUpdated } = useSensorData()
  const [history, setHistory] = useState(loadLiveHistory)
  const [range, setRange] = useState<Range>('24h')
  useEffect(() => { if (data && lastUpdated) setHistory(appendLiveHistory(data, lastUpdated)) }, [data, lastUpdated])
  const filteredHistory = useMemo(() => {
    const cutoff = Date.now() - ({ '24h': 24, '7d': 24 * 7, '30d': 24 * 30 }[range] * 60 * 60 * 1000)
    return history.filter((point) => new Date(point.timestamp).getTime() >= cutoff)
  }, [history, range])
  const sensorData = data ? { soilMoisturePercent: data.soilPercent, soilRawValue: data.soilRaw, temperatureCelsius: data.temperature, humidityPercent: data.humidity, isRaining: data.isRaining, rainRawValue: data.rainRaw, waterLevelPercent: null, waterRawValue: data.waterRaw, pumpStatus: data.pumpRunning ? 'on' as const : 'off' as const, connectionStatus: error || !data.esp32Online ? 'offline' as const : 'online' as const, timestamp: (lastUpdated ?? new Date()).toISOString(), dataSource: 'live' as const } : null
  if (loading || !sensorData) return <AppShell><main className="p-8"><div className="h-64 animate-pulse rounded-2xl bg-secondary" /></main></AppShell>
  return <AppShell connectionStatus={sensorData.connectionStatus}><PageHeader title="Analytics" description="Explore sensor history captured from the live ESP32 connection." sensorData={sensorData} action={<span className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-xs font-semibold"><BarChart3 className="size-4 text-primary" />Live snapshots</span>} /><main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8"><p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">Charts use only readings received from the ESP32 and are stored locally in this browser. Historical data will build as the live connection remains active.</p><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold">Time range</p><p className="mt-1 text-xs text-muted-foreground">Show live readings captured during this period.</p></div><div className="flex rounded-xl border bg-card p-1">{([['24h', '24 hours'], ['7d', '7 days'], ['30d', '30 days']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setRange(value)} className={`interactive-control rounded-lg px-3 py-2 text-xs font-semibold ${range === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>{label}</button>)}</div></div><AnalyticsCharts data={filteredHistory} /></main></AppShell>
}
