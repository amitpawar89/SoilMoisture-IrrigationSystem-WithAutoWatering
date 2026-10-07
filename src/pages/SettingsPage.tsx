import { Moon, Palette, RefreshCw, Save, Sun } from 'lucide-react'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/common/PageHeader'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useTheme, type ThemeMode } from '@/hooks/useTheme'

export function SettingsPage() {
  const { sensorData, isLoading } = useDashboardData()
  const { theme, setTheme } = useTheme()
  const [refresh, setRefresh] = useState('30')
  const [defaultView, setDefaultView] = useState('dashboard')
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [unit, setUnit] = useState('celsius')
  if (isLoading || !sensorData) return <AppShell><main className="p-8"><div className="h-64 animate-pulse rounded-2xl bg-secondary" /></main></AppShell>
  return <AppShell connectionStatus={sensorData.connectionStatus}><PageHeader title="Settings" description="Configure this browser-based monitoring experience." sensorData={sensorData} /><main className="mx-auto max-w-[1000px] space-y-6 p-4 sm:p-6 lg:p-8"><SettingSection title="Appearance" icon={Palette} description="Choose a light or dark theme for this device."><div className="grid gap-3 sm:grid-cols-2">{([['light', 'Light', Sun], ['dark', 'Dark', Moon]] as const).map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setTheme(value as ThemeMode)} className={`interactive-control flex items-center gap-3 rounded-xl border p-4 text-left ${theme === value ? 'border-primary bg-primary/10 text-primary' : 'bg-card hover:bg-secondary'}`}><Icon className="size-5" /><span className="text-sm font-semibold">{label}</span></button>)}</div></SettingSection><SettingSection title="Dashboard" icon={RefreshCw} description="These controls are local preferences and do not change ESP32 behavior."><SettingRow label="Auto refresh interval" description="Reserved for future live data updates"><select value={refresh} onChange={(event) => setRefresh(event.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm"><option value="15">15 seconds</option><option value="30">30 seconds</option><option value="60">60 seconds</option></select></SettingRow><SettingRow label="Default dashboard view" description="The page opened by the navigation"><select value={defaultView} onChange={(event) => setDefaultView(event.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm"><option value="dashboard">Dashboard</option><option value="analytics">Analytics</option><option value="sensors">Sensors</option></select></SettingRow></SettingSection><SettingSection title="Notifications & units" icon={Save} description="Frontend-only preferences for this mock monitoring view."><SettingRow label="Alert notifications" description="Show status and warning events in the dashboard"><button type="button" onClick={() => setAlertsEnabled((enabled) => !enabled)} aria-pressed={alertsEnabled} className={`interactive-control rounded-full px-4 py-2 text-xs font-bold ${alertsEnabled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{alertsEnabled ? 'Enabled' : 'Disabled'}</button></SettingRow><SettingRow label="Temperature unit" description="Preferred display unit"><select value={unit} onChange={(event) => setUnit(event.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm"><option value="celsius">Celsius (°C)</option><option value="fahrenheit">Fahrenheit (°F)</option></select></SettingRow></SettingSection></main></AppShell>
}

function SettingSection({ title, description, icon: Icon, children }: { title: string; description: string; icon: typeof Palette; children: React.ReactNode }) {
  return <section className="dashboard-card rounded-2xl bg-card p-5 shadow-sm shadow-slate-200/40 dark:shadow-black/20"><div className="mb-5 flex items-start gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></div><div><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs text-muted-foreground">{description}</p></div></div>{children}</section>
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 border-t py-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div>{children}</div>
}
