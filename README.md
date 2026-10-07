# Smart Irrigation System

Professional React dashboard for an ESP32-based smart irrigation system. The application provides read-only monitoring of soil moisture, environmental conditions, rain detection, water availability, pump state, alerts, and live sensor trends.

The frontend is designed for the final-year engineering project **Smart Irrigation System using ESP32**. The ESP32 remains responsible for sensor calculations and irrigation decisions; the React application displays the values received from the device.

## Features

- Responsive IoT monitoring dashboard
- Live ESP32 sensor data through `GET /api/data`
- Automatic polling every 5 seconds
- Last-known-value retention when the ESP32 temporarily disconnects
- Clear online, offline, loading, and unavailable states
- Read-only pump and irrigation status
- Soil moisture, temperature, humidity, rain, and water sensor monitoring
- Irrigation decision and recent live activity view
- Analytics based on validated ESP32 readings captured locally in the browser
- Light and dark themes
- Responsive sidebar with desktop collapse and mobile drawer navigation
- Accessible status labels, buttons, focus states, and semantic page structure
- No pump-control endpoints or frontend GPIO control

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React

## Project structure

```text
src/
├── components/
│   ├── charts/          # Analytics and chart components
│   ├── common/          # Shared status, theme, and page-header components
│   ├── dashboard/       # Dashboard cards and monitoring sections
│   └── layout/          # Application shell and sidebar navigation
├── data/
│   └── mock/            # Centralized fallback data for non-live views
├── hooks/
│   ├── useSensorData.ts # Live ESP32 polling hook
│   ├── useDashboardData.ts
│   └── useTheme.tsx
├── pages/               # Dashboard, sensors, irrigation, analytics, alerts, settings
├── services/
│   ├── esp32Service.ts  # Validated ESP32 REST client
│   ├── liveAnalyticsHistory.ts
│   └── irrigationDataService.ts
├── types/
│   └── irrigation.ts    # Shared domain types
└── index.css
```

## Application routes

| Route | Purpose |
| --- | --- |
| `/dashboard` | Focused overview of the most important live conditions |
| `/sensors` | Detailed sensor modules, GPIOs, raw readings, and thresholds |
| `/irrigation` | Device-reported irrigation decision and recent activity |
| `/analytics` | Live sensor trends captured by the browser |
| `/alerts` | System warnings, information, and status events |
| `/settings` | Frontend-only appearance, notification, unit, and view preferences |

## Hardware configuration

| Component | ESP32 pin |
| --- | --- |
| Capacitive soil moisture sensor | GPIO34 |
| Rain sensor | GPIO35 |
| DHT22 temperature and humidity sensor | GPIO4 |
| Water level sensor | GPIO36 |
| Relay module | GPIO26 |
| Buzzer | GPIO25 |
| LCD SDA | GPIO21 |
| LCD SCL | GPIO22 |

### Calibration values

```text
Soil wet value:       1200
Soil dry value:       3000
Rain threshold:       2000
Water low threshold:  800
```

### Irrigation decision

The ESP32 determines whether irrigation should run:

```text
soilIsDry = soilPercent < 40
isRaining = rainRaw < 2000
waterLow = waterRaw < 800

pumpShouldRun = soilIsDry && !isRaining && !waterLow
```

The frontend does not recalculate this decision or change these thresholds. It displays `pumpRunning`, `isRaining`, `waterLow`, and `soilPercent` as received from the ESP32.

## ESP32 API

Configure the ESP32 base URL in a local `.env` file:

```env
VITE_ESP32_URL=http://ESP32_IP_ADDRESS
```

For the current local device, use the IP address supplied by your own network. Do not commit `.env`; it is excluded by `.gitignore`.

The frontend requests:

```text
GET ${VITE_ESP32_URL}/api/data
```

Expected response:

```json
{
  "soilRaw": 4095,
  "soilPercent": 0,
  "temperature": 31.9,
  "humidity": 63.5,
  "rainRaw": 4095,
  "isRaining": false,
  "waterRaw": 235,
  "waterLow": true,
  "pumpRunning": false,
  "esp32Online": true
}
```

All fields must use the expected basic types:

| Field | Type | Description |
| --- | --- | --- |
| `soilRaw` | number | Raw soil sensor ADC value |
| `soilPercent` | number | ESP32-calculated soil moisture percentage |
| `temperature` | number | DHT22 temperature in Celsius |
| `humidity` | number | DHT22 relative humidity percentage |
| `rainRaw` | number | Raw rain sensor ADC value |
| `isRaining` | boolean | Device-reported rain state |
| `waterRaw` | number | Raw water sensor ADC value |
| `waterLow` | boolean | Device-reported low-water state |
| `pumpRunning` | boolean | Device-reported pump state |
| `esp32Online` | boolean | Device connection state |

The ESP32 must allow requests from the Vite development server through CORS. The frontend does not use a proxy or CORS workaround.

See [`docs/esp32-api.md`](docs/esp32-api.md) for the complete API contract.

## Live data behavior

`useSensorData()`:

1. Fetches sensor data immediately when a page starts using it.
2. Polls the ESP32 every 5 seconds.
3. Validates each response before updating the UI.
4. Keeps the last valid reading if a later request fails.
5. Marks the connection offline when the device cannot be reached.
6. Recovers automatically when the ESP32 becomes reachable again.
7. Never replaces unavailable live values with random or fake values.

Analytics history is built from actual validated snapshots received by the browser and stored in local storage. The current `/api/data` endpoint returns only the latest snapshot, so the frontend cannot display historical readings that were never received.

## Getting started

### Requirements

- Node.js 20 or newer
- npm
- ESP32 connected to the same network as the development computer for live monitoring

### Install dependencies

```bash
npm install
```

### Configure the ESP32 URL

Create `.env` in the project root:

```env
VITE_ESP32_URL=http://ESP32_IP_ADDRESS
```

Restart the Vite server after changing environment variables.

### Start development server

```bash
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173/dashboard
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Mock data

The project contains centralized mock data for development of routed views that are not yet connected to a dedicated backend history or alert endpoint. Mock values are kept outside presentation components.

The live dashboard and live irrigation/analytics views use the ESP32 service when the live hook is active. Mock values are never used as a fallback after a live request fails.

## Current scope

Included:

- Frontend monitoring experience
- ESP32 read-only data integration
- Responsive navigation and themes
- Live sensor status and analytics snapshots
- Irrigation decision display

Not included yet:

- Pump control from the browser
- Authentication
- Database storage
- Backend API
- Historical data API on the ESP32
- User management
- ESP32 firmware source in this repository

The frontend does not send `POST`, `PUT`, or `DELETE` requests and cannot control GPIO26.

## Hardware verification

The repository contains the React frontend and API adapter, but no Arduino or ESP32 firmware source. The following must be verified on the physical device separately:

- Wi-Fi connection and IP address
- Sensor wiring and GPIO initialization
- Relay and pump behavior
- Buzzer and LCD behavior
- ESP32 CORS headers
- Sensor changes reflected by `/api/data`

## License

This project is intended for academic and engineering-project use. Add a project-specific license before distributing it publicly.
