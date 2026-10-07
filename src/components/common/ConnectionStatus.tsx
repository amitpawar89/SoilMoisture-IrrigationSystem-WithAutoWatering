import { Wifi, WifiOff } from 'lucide-react'
import type { ConnectionStatus as ConnectionState } from '@/types/irrigation'
import { StatusBadge } from './StatusBadge'

interface ConnectionStatusProps {
  status: ConnectionState
  compact?: boolean
}

export function ConnectionStatus({ status, compact = false }: ConnectionStatusProps) {
  const isOnline = status === 'online'
  const label = isOnline ? 'ESP32 online' : status === 'offline' ? 'ESP32 offline' : 'Connection unknown'

  return (
    <StatusBadge tone={isOnline ? 'success' : 'neutral'} dot={false}>
      {isOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
      {!compact && label}
      {compact && <span className="sr-only">{label}</span>}
    </StatusBadge>
  )
}
