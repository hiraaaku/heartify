# Heartify API Documentation

Base URL: `https://api.diniweb.site`

## Authentication
Saat ini tidak ada authentication (public API).

---

## Endpoints

### Health Check

#### GET /
```json
Response 200:
{
  "status": "ok",
  "service": "Heartify Backend",
  "version": "1.0.0",
  "websocket_clients": 0
}
```

#### GET /api/health
```json
Response 200:
{
  "status": "healthy",
  "database": "connected"
}
```

---

### Dashboard

#### GET /api/dashboard
Statistik untuk halaman dashboard.

```json
Response 200:
{
  "total_patients": 24,
  "total_recordings": 156,
  "avg_heart_rate": 75.5,
  "latest_status": "Normal",
  "normal_count": 22,
  "abnormal_count": 2,
  "active_monitoring": 0
}
```

#### GET /api/dashboard/trend
Trend heart rate untuk chart.

Query params:
- `days` (optional, default: 7)

```json
Response 200:
[
  {"day": "2024-11-10", "avg_hr": 72.5},
  {"day": "2024-11-11", "avg_hr": 75.0},
  {"day": "2024-11-12", "avg_hr": 73.2}
]
```

#### GET /api/dashboard/recent
Rekaman terbaru untuk tabel.

Query params:
- `limit` (optional, default: 10)

```json
Response 200:
[
  {
    "id": 1,
    "patient_name": "Budi Santoso",
    "patient_age": 45,
    "timestamp": "2024-11-15T10:30:00",
    "heart_rate": 72,
    "status": "Normal",
    "duration": 300
  }
]
```

---

### Patients

#### GET /api/patients
List semua pasien.

```json
Response 200:
[
  {
    "id": 1,
    "name": "Budi Santoso",
    "age": 45,
    "created_at": "2024-11-01T08:00:00"
  }
]
```

#### POST /api/patients
Buat pasien baru.

```json
Request Body:
{
  "name": "Nama Pasien",
  "age": 50
}

Response 200:
{
  "id": 5,
  "name": "Nama Pasien",
  "age": 50,
  "created_at": "2024-11-15T10:00:00"
}
```

#### GET /api/patients/{patient_id}
Detail satu pasien.

```json
Response 200:
{
  "id": 1,
  "name": "Budi Santoso",
  "age": 45,
  "created_at": "2024-11-01T08:00:00"
}
```

#### DELETE /api/patients/{patient_id}
Hapus pasien.

```json
Response 200:
{
  "success": true,
  "message": "Patient deleted"
}
```

---

### Recordings

#### POST /api/recording
Endpoint untuk menerima data dari IoT device.

```json
Request Body:
{
  "patient_id": 1,
  "ecg_value": 52.34,
  "pcg_value": 41.22,
  "heart_rate": 72,
  "status": "Normal"  // optional, auto-detect dari HR
}

Response 200:
{
  "success": true,
  "id": 123,
  "status": "Normal"
}
```

#### GET /api/recordings
List recordings dengan filter.

Query params:
- `patient_id` (optional) - filter by pasien
- `status` (optional) - "Normal" atau "Abnormal"
- `date` (optional) - format YYYY-MM-DD
- `limit` (optional, default: 100, max: 1000)
- `offset` (optional, default: 0)

```json
Response 200:
[
  {
    "id": 1,
    "patient_id": 1,
    "patient_name": "Budi Santoso",
    "timestamp": "2024-11-15T10:30:00",
    "ecg_value": 52.34,
    "pcg_value": 41.22,
    "heart_rate": 72,
    "status": "Normal",
    "duration": 300
  }
]
```

#### GET /api/recordings/latest/{patient_id}
Data terakhir untuk grafik realtime.

Query params:
- `limit` (optional, default: 100)

```json
Response 200:
[
  {
    "id": 1,
    "patient_id": 1,
    "timestamp": "2024-11-15T10:30:00",
    "ecg_value": 52.34,
    "pcg_value": 41.22,
    "heart_rate": 72,
    "status": "Normal",
    "duration": 0
  }
]
```

#### GET /api/recordings/count
Hitung total recordings.

Query params:
- `patient_id` (optional)
- `status` (optional)

```json
Response 200:
{
  "count": 156
}
```

---

### Export

#### GET /api/export/csv
Export data ke CSV file.

Query params:
- `patient_id` (optional)
- `start_date` (optional) - format YYYY-MM-DD
- `end_date` (optional) - format YYYY-MM-DD

Response: CSV file download

---

### WebSocket

#### WS /ws/live
Realtime updates untuk semua data baru.

```json
// Server sends:
{"type": "connected", "message": "Connected to Heartify realtime"}
{"type": "heartbeat"}
{"type": "new_recording", "data": {...}}

// Client can send:
"ping" -> Server responds with {"type": "pong"}
```

#### WS /ws/live/{patient_id}
Realtime updates untuk satu pasien.

```json
// On connect, server sends initial data:
{
  "type": "initial_data",
  "data": [
    {"id": 1, "ecg_value": 52.34, ...},
    ...
  ]
}

// Then sends new recordings:
{"type": "new_recording", "data": {...}}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## Heart Rate Status Logic

```
HR < 60  → "Abnormal" (Bradycardia)
HR 60-100 → "Normal"
HR > 100 → "Abnormal" (Tachycardia)
```
