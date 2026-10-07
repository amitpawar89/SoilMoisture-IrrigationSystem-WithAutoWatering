export type PumpStatus = 'on' | 'off' | 'unknown'
export type ConnectionStatus = 'online' | 'offline' | 'unknown'
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success'
export type ActivityType = 'pump' | 'sensor' | 'connection' | 'alert'
export type DataSource = 'mock' | 'live'

export interface SensorData {
  soilMoisturePercent: number
  soilRawValue: number
  temperatureCelsius: number
  humidityPercent: number
  isRaining: boolean
  rainRawValue: number
  waterLevelPercent: number | null
  waterRawValue: number
  pumpStatus: PumpStatus
  connectionStatus: ConnectionStatus
  timestamp: string
  dataSource: DataSource
}

export interface SensorHistoryPoint {
  timestamp: string
  soilMoisturePercent: number
  temperatureCelsius: number
  humidityPercent: number
  waterLevelPercent: number | null
  waterRawValue?: number
  pumpRunning: boolean
  isRaining: boolean
}

export interface SystemAlert {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  timestamp: string
}

export interface ActivityEvent {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

export interface IrrigationDataService {
  getCurrentSensorData(): Promise<SensorData>
  getSensorHistory(): Promise<SensorHistoryPoint[]>
  getAlerts(): Promise<SystemAlert[]>
  getActivity(): Promise<ActivityEvent[]>
}
