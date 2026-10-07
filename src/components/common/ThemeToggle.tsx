import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const label = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="interactive-control flex min-h-11 min-w-11 items-center justify-center rounded-xl border bg-card p-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
    >
      {theme === 'light' ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
    </button>
  )
}
