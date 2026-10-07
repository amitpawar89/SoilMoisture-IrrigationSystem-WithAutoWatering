import { Activity, CloudRain, Droplets, Gauge, Power, Thermometer, Waves } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SensorHistoryPoint } from '@/types/irrigation'

interface AnalyticsChartsProps {
  data: SensorHistoryPoint[]
}

type ChartKey = 'soilMoisturePercent' | 'temperatureCelsius' | 'humidityPercent' | 'waterRawValue' | 'pumpActivity' | 'rainEvents'

interface ChartDefinition {
  key: ChartKey
  title: string
  description: string
  unit: string
  color: string
  icon: typeof Droplets
  domain: [number | 'auto', number | 'auto']
  formatValue: (value: number) => string
  formatAxis: (value: number) => string
}

const percent = (value: number) => `${value}%`
const degrees = (value: number) => `${value}°C`
const adc = (value: number) => `${value} ADC`
const state = (value: number) => (value === 1 ? 'ON' : 'OFF')
const rainState = (value: number) => (value === 1 ? 'Detected' : 'Clear')

const charts: ChartDefinition[] = [
  { key: 'soilMoisturePercent', title: 'Soil moisture', description: 'How much moisture is in the soil', unit: '%', color: 'var(--color-chart-primary)', icon: Droplets, domain: [0, 100], formatValue: percent, formatAxis: (value) => `${value}%` },
  { key: 'temperatureCelsius', title: 'Temperature', description: 'DHT22 ambient temperature', unit: '°C', color: '#f59e0b', icon: Thermometer, domain: ['auto', 'auto'], formatValue: degrees, formatAxis: (value) => `${value}°` },
  { key: 'humidityPercent', title: 'Humidity', description: 'DHT22 relative humidity', unit: '%', color: '#60a5fa', icon: Waves, domain: [0, 100], formatValue: percent, formatAxis: (value) => `${value}%` },
  { key: 'waterRawValue', title: 'Water sensor', description: 'Raw water-level sensor signal', unit: 'ADC', color: '#22d3ee', icon: Gauge, domain: [0, 4095], formatValue: adc, formatAxis: (value) => `${value}`, },
  { key: 'pumpActivity', title: 'Pump activity', description: 'ESP32-reported pump state', unit: 'state', color: '#34d399', icon: Power, domain: [0, 1], formatValue: state, formatAxis: state },
  { key: 'rainEvents', title: 'Rain detection', description: 'ESP32-reported rain state', unit: 'status', color: '#818cf8', icon: CloudRain, domain: [0, 1], formatValue: rainState, formatAxis: rainState },
]

function getLatestValue(data: SensorHistoryPoint[], key: ChartKey): number | null {
  const latest = data.at(-1)
  if (!latest) return null
  if (key === 'pumpActivity') return latest.pumpRunning ? 1 : 0
  if (key === 'rainEvents') return latest.isRaining ? 1 : 0
  if (key === 'waterRawValue') return latest.waterRawValue ?? null
  return latest[key]
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const chartData = data.map((point) => ({
    ...point,
    waterRawValue: point.waterRawValue ?? null,
    pumpActivity: point.pumpRunning ? 1 : 0,
    rainEvents: point.isRaining ? 1 : 0,
    time: formatTimestamp(point.timestamp),
  }))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Live sensor trends</p>
          <p className="mt-1 text-xs text-muted-foreground">Each point is one validated reading from the ESP32.</p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          {data.length} {data.length === 1 ? 'reading' : 'readings'} captured
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {charts.map(({ key, title, description, unit, color, icon: Icon, domain, formatValue, formatAxis }) => {
          const latestValue = getLatestValue(data, key)
          return (
            <section key={key} className="dashboard-card overflow-hidden rounded-2xl bg-card shadow-sm shadow-slate-200/40 dark:shadow-black/20">
              <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`, color }}>
                      <Icon className="size-4" />
                    </span>
                    {title}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{description} · {unit}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold tabular-nums">{latestValue === null ? '—' : formatValue(latestValue)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Latest</p>
                </div>
              </div>

              <div className="h-64 min-w-0 px-3 pb-3 pt-4">
                {data.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed text-center">
                    <Activity className="size-5 text-muted-foreground" />
                    <p className="mt-2 text-sm font-semibold">Waiting for ESP32 readings</p>
                    <p className="mt-1 max-w-xs px-4 text-xs text-muted-foreground">The chart will appear after the first valid sensor response.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                      <defs>
                        <linearGradient id={`analytics-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.34} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
                      <XAxis dataKey="time" tick={{ fill: 'var(--color-chart-label)', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
                      <YAxis domain={domain} tickFormatter={formatAxis} tick={{ fill: 'var(--color-chart-label)', fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
                      {key === 'soilMoisturePercent' && <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Dry threshold 40%', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10 }} />}
                      <Tooltip
                        labelFormatter={(label) => `Recorded at ${label}`}
                        formatter={(value) => [formatValue(Number(value)), title]}
                        contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)' }}
                      />
                      <Area type="monotone" dataKey={key} name={title} stroke={color} strokeWidth={2.5} fill={`url(#analytics-gradient-${key})`} dot={{ r: data.length === 1 ? 5 : 2.5, fill: color, strokeWidth: 2, stroke: 'var(--color-card)' }} activeDot={{ r: 6 }} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
