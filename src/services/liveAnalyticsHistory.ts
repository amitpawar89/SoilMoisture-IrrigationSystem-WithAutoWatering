import type { SensorData as LiveSensorData } from '@/services/esp32Service'
import type { SensorHistoryPoint } from '@/types/irrigation'

const STORAGE_KEY = 'smart-irrigation-live-history'
const MAX_POINTS = 500

function toHistoryPoint(data: LiveSensorData, timestamp: Date): SensorHistoryPoint {
  return {
    timestamp: timestamp.toISOString(),
    soilMoisturePercent: data.soilPercent,
    temperatureCelsius: data.temperature,
    humidityPercent: data.humidity,
    waterLevelPercent: null,
    waterRawValue: data.waterRaw,
    pumpRunning: data.pumpRunning,
    isRaining: data.isRaining,
  }
}

export function loadLiveHistory(): SensorHistoryPoint[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((point): point is SensorHistoryPoint => {
      if (!point || typeof point !== 'object') return false
      const value = point as Record<string, unknown>
      return typeof value.timestamp === 'string'
        && typeof value.soilMoisturePercent === 'number'
        && typeof value.temperatureCelsius === 'number'
        && typeof value.humidityPercent === 'number'
        && typeof value.waterRawValue === 'number'
        && typeof value.pumpRunning === 'boolean'
        && typeof value.isRaining === 'boolean'
    })
  } catch {
    return []
  }
}

export function appendLiveHistory(data: LiveSensorData, timestamp: Date): SensorHistoryPoint[] {
  const next = [...loadLiveHistory(), toHistoryPoint(data, timestamp)].slice(-MAX_POINTS)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
