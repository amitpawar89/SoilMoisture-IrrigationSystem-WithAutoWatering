import { Activity, BarChart3, Bell, ChevronsLeft, ChevronsRight, Droplets, LayoutDashboard, Leaf, Settings, Sprout, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConnectionStatus } from '@/components/common/ConnectionStatus'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  mobileOpen: boolean
  desktopCollapsed: boolean
  onClose: () => void
  onDesktopToggle: () => void
  connectionStatus: 'online' | 'offline' | 'unknown'
}

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Sensors', icon: Activity, path: '/sensors' },
  { label: 'Irrigation', icon: Droplets, path: '/irrigation' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

export function Sidebar({ mobileOpen, desktopCollapsed, onClose, onDesktopToggle, connectionStatus }: SidebarProps) {
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation overlay" type="button" onClick={onClose} className="fixed inset-0 z-30 bg-slate-950/30 dark:bg-black/55 lg:hidden" />}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-[min(18rem,calc(100vw-2rem))] flex-col overflow-y-auto overscroll-contain border-r bg-[var(--color-sidebar)] px-4 py-5 shadow-xl shadow-black/10 transition-[width,transform] duration-200 [scrollbar-width:thin] lg:w-64 lg:shadow-none',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
        desktopCollapsed ? 'lg:w-20 lg:px-3' : 'lg:w-64',
      )}>
        <div className={cn('group relative sticky top-0 z-10 flex shrink-0 items-center gap-3 bg-[var(--color-sidebar)] px-3 pb-1', desktopCollapsed && 'lg:justify-center lg:px-0')}>
          <div className="interactive-control flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="size-5 transition-transform duration-200 group-hover:rotate-[-8deg]" />
          </div>
          <div className={cn('min-w-0', desktopCollapsed && 'lg:hidden')}>
            <p className="truncate font-display text-sm font-bold tracking-tight">Smart Irrigation</p>
            <p className="truncate text-xs text-muted-foreground">Field monitoring</p>
          </div>
          <button type="button" aria-label="Close navigation" onClick={onClose} className="interactive-control ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-secondary lg:hidden">
            <X className="size-4" />
          </button>
          <button type="button" aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onDesktopToggle} className={cn('interactive-control ml-auto hidden rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground lg:block', desktopCollapsed && 'lg:absolute lg:-right-1 lg:top-0 lg:translate-x-full lg:bg-card lg:shadow-sm')}>
            {desktopCollapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        </div>

        <nav className={cn('mt-10 flex shrink-0 flex-col space-y-1', desktopCollapsed && 'lg:mt-6')} aria-label="Primary navigation">
          <p className={cn('mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground', desktopCollapsed && 'lg:hidden')}>Workspace</p>
          {navigation.map(({ label, icon: Icon, path }) => (
            <NavLink key={label} to={path} onClick={onClose} className={({ isActive }) => cn(
              'nav-item flex min-h-11 w-full shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
              desktopCollapsed && 'lg:justify-center lg:px-0',
              isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )} end={path === '/dashboard'}>
              <Icon className="size-[18px]" />
              <span className={desktopCollapsed ? 'lg:hidden' : undefined}>{label}</span>
              {label === 'Alerts' && <span className={cn('ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300', desktopCollapsed && 'lg:absolute lg:right-1 lg:top-1')}>2</span>}
            </NavLink>
          ))}
        </nav>

        <div className={cn('mt-8 shrink-0 rounded-2xl border bg-secondary/50 p-3', desktopCollapsed && 'lg:flex lg:justify-center lg:border-0 lg:bg-transparent lg:p-0')}>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-card text-primary">
              <Sprout className="size-4" />
            </div>
            <div className={cn('min-w-0', desktopCollapsed && 'lg:hidden')}>
              <p className="truncate text-xs font-bold">System status</p>
              <p className="truncate text-[11px] text-muted-foreground">{connectionStatus === 'online' ? 'All systems healthy' : 'Connection needs attention'}</p>
            </div>
          </div>
          <div className={desktopCollapsed ? 'lg:hidden' : undefined}><ConnectionStatus status={connectionStatus} /></div>
        </div>
        <p className={cn('px-3 pt-4 text-[10px] text-muted-foreground', desktopCollapsed && 'lg:hidden')}>v1.0.0 · Local deployment</p>
      </aside>
    </>
  )
}
