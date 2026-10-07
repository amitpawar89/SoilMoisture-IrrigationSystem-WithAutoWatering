import { mockActivity, mockAlerts, mockSensorData, mockSensorHistory } from '@/data/mock/mockSensorData'
import type { ActivityEvent, IrrigationDataService, SensorData, SensorHistoryPoint, SystemAlert } from '@/types/irrigation'
import { esp32BaseUrl, esp32DataService } from '@/services/esp32DataService'

export const mockIrrigationDataService: IrrigationDataService = {
  async getCurrentSensorData(): Promise<SensorData> {
    return mockSensorData
  },

  async getSensorHistory(): Promise<SensorHistoryPoint[]> {
    return mockSensorHistory
  },

  async getAlerts(): Promise<SystemAlert[]> {
    return mockAlerts
  },

  async getActivity(): Promise<ActivityEvent[]> {
    return mockActivity
  },
}

export const irrigationDataService: IrrigationDataService = {
  async getCurrentSensorData() {
    return esp32BaseUrl ? esp32DataService.getCurrentSensorData() : mockIrrigationDataService.getCurrentSensorData()
  },
  getSensorHistory: () => mockIrrigationDataService.getSensorHistory(),
  getAlerts: () => mockIrrigationDataService.getAlerts(),
  getActivity: () => mockIrrigationDataService.getActivity(),
}
