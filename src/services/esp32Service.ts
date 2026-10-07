const ESP32_URL = import.meta.env.VITE_ESP32_URL

export interface SensorData {
  soilRaw: number
  soilPercent: number
  temperature: number
  humidity: number
  rainRaw: number
  isRaining: boolean
  waterRaw: number
  waterLow: boolean
  pumpRunning: boolean
  esp32Online: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseSensorData(value: unknown): SensorData {
  if (!isRecord(value)
    || typeof value.soilRaw !== 'number'
    || typeof value.soilPercent !== 'number'
    || typeof value.temperature !== 'number'
    || typeof value.humidity !== 'number'
    || typeof value.rainRaw !== 'number'
    || typeof value.isRaining !== 'boolean'
    || typeof value.waterRaw !== 'number'
    || typeof value.waterLow !== 'boolean'
    || typeof value.pumpRunning !== 'boolean'
    || typeof value.esp32Online !== 'boolean') {
    throw new Error('ESP32 returned an invalid sensor response.')
  }

  return {
    soilRaw: value.soilRaw,
    soilPercent: value.soilPercent,
    temperature: value.temperature,
    humidity: value.humidity,
    rainRaw: value.rainRaw,
    isRaining: value.isRaining,
    waterRaw: value.waterRaw,
    waterLow: value.waterLow,
    pumpRunning: value.pumpRunning,
    esp32Online: value.esp32Online,
  }
}

export async function getSensorData(): Promise<SensorData> {
  if (!ESP32_URL) {
    throw new Error('VITE_ESP32_URL is not configured.')
  }

  let response: Response
  try {
    response = await fetch(`${ESP32_URL.replace(/\/$/, '')}/api/data`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new Error('Unable to reach the ESP32. Check the hotspot connection.')
  }

  if (!response.ok) {
    throw new Error(`ESP32 request failed with status ${response.status}.`)
  }

  return parseSensorData(await response.json())
}

export { ESP32_URL }
