import { Activity } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SensorHistoryPoint } from '@/types/irrigation'

interface EnvironmentChartProps {
  data: SensorHistoryPoint[]
}

export function EnvironmentChart({ data }: EnvironmentChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  return (
    <div className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold"><Activity className="size-4 text-primary" />Environmental trends</p>
          <p className="mt-1 text-xs text-muted-foreground">Temperature and humidity over the last 12 hours</p>
        </div>
        <div className="hidden gap-3 text-[11px] font-medium text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-primary" />Temperature</span>
          <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-amber-400" />Humidity</span>
        </div>
      </div>
      <div className="h-64 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: 'var(--color-chart-label)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="temperature" tick={{ fill: 'var(--color-chart-label)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="humidity" orientation="right" domain={[0, 100]} hide />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)' }} />
            <Line yAxisId="temperature" type="monotone" dataKey="temperatureCelsius" name="Temperature (°C)" stroke="var(--color-chart-primary)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-chart-primary)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line yAxisId="humidity" type="monotone" dataKey="humidityPercent" name="Humidity (%)" stroke="var(--color-chart-secondary)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-chart-secondary)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
