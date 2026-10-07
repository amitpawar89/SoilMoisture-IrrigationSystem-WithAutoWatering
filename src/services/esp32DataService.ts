import { ESP32_URL, getSensorData } from '@/services/esp32Service'
import type { IrrigationDataService, SensorData } from '@/types/irrigation'

function toDashboardSensorData(data: Awaited<ReturnType<typeof getSensorData>>): SensorData {
  return {
    soilMoisturePercent: data.soilPercent,
    soilRawValue: data.soilRaw,
    temperatureCelsius: data.temperature,
    humidityPercent: data.humidity,
    isRaining: data.isRaining,
    rainRawValue: data.rainRaw,
    waterLevelPercent: null,
    waterRawValue: data.waterRaw,
    pumpStatus: data.pumpRunning ? 'on' : 'off',
    connectionStatus: data.esp32Online ? 'online' : 'offline',
    timestamp: new Date().toISOString(),
    dataSource: 'live',
  }
}

export const esp32DataService: Pick<IrrigationDataService, 'getCurrentSensorData'> = {
  async getCurrentSensorData(): Promise<SensorData> {
    return toDashboardSensorData(await getSensorData())
  },
}

export const esp32BaseUrl = ESP32_URL
