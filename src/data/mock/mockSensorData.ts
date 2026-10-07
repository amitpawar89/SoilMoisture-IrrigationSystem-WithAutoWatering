import type { ActivityEvent, SensorData, SensorHistoryPoint, SystemAlert } from '@/types/irrigation'

export const mockSensorData: SensorData = {
  soilMoisturePercent: 61,
  soilRawValue: 1896,
  temperatureCelsius: 27.4,
  humidityPercent: 68,
  isRaining: false,
  rainRawValue: 2860,
  waterLevelPercent: 76,
  waterRawValue: 2140,
  pumpStatus: 'off',
  connectionStatus: 'online',
  timestamp: '2026-10-07T18:25:00.000Z',
  dataSource: 'mock',
}

export const mockSensorHistory: SensorHistoryPoint[] = [
  { timestamp: '2026-10-07T06:00:00.000Z', soilMoisturePercent: 64, temperatureCelsius: 22.1, humidityPercent: 81, waterLevelPercent: 84, pumpRunning: false, isRaining: true },
  { timestamp: '2026-10-07T09:00:00.000Z', soilMoisturePercent: 61, temperatureCelsius: 25.8, humidityPercent: 73, waterLevelPercent: 81, pumpRunning: false, isRaining: false },
  { timestamp: '2026-10-07T12:00:00.000Z', soilMoisturePercent: 58, temperatureCelsius: 29.2, humidityPercent: 59, waterLevelPercent: 78, pumpRunning: true, isRaining: false },
  { timestamp: '2026-10-07T15:00:00.000Z', soilMoisturePercent: 56, temperatureCelsius: 30.1, humidityPercent: 54, waterLevelPercent: 76, pumpRunning: false, isRaining: false },
  { timestamp: '2026-10-07T18:00:00.000Z', soilMoisturePercent: 61, temperatureCelsius: 27.4, humidityPercent: 68, waterLevelPercent: 76, pumpRunning: false, isRaining: false },
]

export const mockAlerts: SystemAlert[] = [
  {
    id: 'alert-system-normal',
    severity: 'success',
    title: 'System operating normally',
    message: 'All sensors are reporting within expected ranges.',
    timestamp: '2026-10-07T18:25:00.000Z',
  },
  {
    id: 'alert-soil-status',
    severity: 'info',
    title: 'Soil moisture is optimal',
    message: 'Current moisture is above the irrigation threshold.',
    timestamp: '2026-10-07T18:20:00.000Z',
  },
]

export const mockActivity: ActivityEvent[] = [
  {
    id: 'activity-esp-connected',
    type: 'connection',
    title: 'ESP32 connected',
    description: 'Device is online and sending sensor readings.',
    timestamp: '2026-10-07T18:18:00.000Z',
  },
  {
    id: 'activity-soil-check',
    type: 'sensor',
    title: 'Soil moisture checked',
    description: 'Moisture level measured at 61%.',
    timestamp: '2026-10-07T18:20:00.000Z',
  },
  {
    id: 'activity-pump-stopped',
    type: 'pump',
    title: 'Pump remains off',
    description: 'Soil moisture is sufficient for irrigation to remain inactive.',
    timestamp: '2026-10-07T18:22:00.000Z',
  },
  {
    id: 'activity-system-normal',
    type: 'alert',
    title: 'System check complete',
    description: 'No active irrigation alerts detected.',
    timestamp: '2026-10-07T18:25:00.000Z',
  },
]
