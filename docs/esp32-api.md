# ESP32 REST API contract

The React app reads live data when `VITE_ESP32_URL` is configured. It requests:

```text
GET {VITE_ESP32_URL}/api/data
```

The ESP32 must return JSON with numeric and boolean values, not strings:

```json
{
  "soilRaw": 1896,
  "soilPercent": 61,
  "temperature": 27.4,
  "humidity": 68,
  "rainRaw": 2860,
  "isRaining": false,
  "waterRaw": 2140,
  "waterLow": false,
  "pumpRunning": false,
  "esp32Online": true
}
```

## Fields

| Field | Type | Meaning |
| --- | --- | --- |
| `soilRaw` | number | Capacitive soil ADC value from GPIO34 |
| `soilPercent` | number | Soil percentage using wet `1200` and dry `3000` calibration |
| `temperature` | number | DHT22 temperature in degrees Celsius from GPIO4 |
| `humidity` | number | DHT22 relative humidity percentage |
| `rainRaw` | number | Rain sensor ADC value from GPIO35 |
| `isRaining` | boolean | `rainRaw < 2000` |
| `waterRaw` | number | Water-level ADC value from GPIO36 |
| `waterLow` | boolean | `waterRaw < 800` |
| `pumpRunning` | boolean | Device irrigation decision |
| `esp32Online` | boolean | Device connection state |

The frontend does not infer or replace the pump decision. The ESP32 must preserve:

```text
soilPercent < 40
rainRaw < 2000
waterRaw < 800
pumpShouldRun = soilIsDry && !isRaining && !waterLow
```

No water-level percentage is assumed because the project has not established a water ADC calibration. The React UI displays the raw value and availability state for live data.

## CORS and connectivity

The ESP32 response must include an appropriate `Access-Control-Allow-Origin` header so the Vite development server can call it. The React app does not use a browser CORS workaround.

Configure the local frontend without committing a device IP:

```text
VITE_ESP32_URL=http://ESP32_IP_ADDRESS
```

When `VITE_ESP32_URL` is absent, the app explicitly uses centralized mock data and labels the header `MOCK MONITORING`. When configured, it polls `/api/data` every 10 seconds and labels the header `LIVE MONITORING`.

If a live request fails after a successful response, the UI retains the last known readings and marks the connection `ESP32 offline`. It does not replace disconnected live data with fake values.

## Hardware verification still required

This repository currently contains no Arduino/ESP32 source file, so the following cannot be verified from the frontend workspace:

- Wi-Fi connection and printed IP address
- GPIO initialization
- relay, buzzer, and LCD behavior
- ESP32 server and CORS implementation
- physical sensor changes at `/api/data`
