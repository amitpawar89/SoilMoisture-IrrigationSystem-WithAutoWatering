import { useEffect, useState } from 'react'
import { irrigationDataService } from '@/services/irrigationDataService'
import type { ActivityEvent, SensorData, SensorHistoryPoint, SystemAlert } from '@/types/irrigation'

interface DashboardData {
  sensorData: SensorData | null
  history: SensorHistoryPoint[]
  alerts: SystemAlert[]
  activity: ActivityEvent[]
  isLoading: boolean
  error: string | null
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    sensorData: null,
    history: [],
    alerts: [],
    activity: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      try {
        const [sensorData, history, alerts, activity] = await Promise.all([
          irrigationDataService.getCurrentSensorData(),
          irrigationDataService.getSensorHistory(),
          irrigationDataService.getAlerts(),
          irrigationDataService.getActivity(),
        ])

        if (isMounted) {
          setData({ sensorData, history, alerts, activity, isLoading: false, error: null })
        }
      } catch {
        if (isMounted) {
          setData((current) => ({
            ...current,
            sensorData: current.sensorData
              ? { ...current.sensorData, connectionStatus: 'offline' }
              : null,
            isLoading: false,
            error: current.sensorData ? null : 'Unable to load sensor data.',
          }))
        }
      }
    }

    void loadDashboardData()
    const refreshId = window.setInterval(() => {
      void loadDashboardData().catch(() => undefined)
    }, 10000)
    return () => {
      isMounted = false
      window.clearInterval(refreshId)
    }
  }, [])

  return data
}
