import { DashboardPage } from '@/pages/DashboardPage'
import { ThemeProvider } from '@/hooks/useTheme'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SensorsPage } from '@/pages/SensorsPage'
import { IrrigationPage } from '@/pages/IrrigationPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AlertsPage } from '@/pages/AlertsPage'
import { SettingsPage } from '@/pages/SettingsPage'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sensors" element={<SensorsPage />} />
          <Route path="/irrigation" element={<IrrigationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
