import { useCallback, useEffect, useRef, useState } from 'react'
import { getSensorData, type SensorData } from '@/services/esp32Service'

interface SensorDataState {
  data: SensorData | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
}

export function useSensorData(): SensorDataState {
  const [data, setData] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const requestInFlight = useRef(false)
  const hasData = useRef(false)

  const refetch = useCallback(async () => {
    if (requestInFlight.current) return
    requestInFlight.current = true
    setLoading((current) => current && !hasData.current)

    try {
      const nextData = await getSensorData()
      setData(nextData)
      hasData.current = true
      setLastUpdated(new Date())
      setError(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load ESP32 data.')
    } finally {
      requestInFlight.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
    const intervalId = window.setInterval(() => {
      void refetch()
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [refetch])

  return { data, loading, error, lastUpdated, refetch }
}
