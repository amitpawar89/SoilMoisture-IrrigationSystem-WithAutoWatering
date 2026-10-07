import { useEffect, useState, type ReactNode } from 'react'
import { Leaf, Menu, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import type { ConnectionStatus as ConnectionState } from '@/types/irrigation'

interface AppShellProps {
  children: ReactNode
  connectionStatus?: ConnectionState
}

export function AppShell({ children, connectionStatus = 'unknown' }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} desktopCollapsed={desktopCollapsed} onClose={() => setMobileOpen(false)} onDesktopToggle={() => setDesktopCollapsed((collapsed) => !collapsed)} connectionStatus={connectionStatus} />
      <div className={desktopCollapsed ? 'lg:pl-20' : 'lg:pl-64'}>
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-3 backdrop-blur lg:hidden sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="interactive-control flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-4" />
            </div>
            <span className="truncate font-display text-sm font-bold">Smart Irrigation</span>
          </div>
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  )
}
