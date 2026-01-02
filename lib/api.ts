export const API_BASE = 'https://api.diniweb.site';

export interface DashboardStats {
  total_patients: number;
  total_recordings: number;
  avg_heart_rate: number;
  latest_status: string;
  normal_count: number;
  abnormal_count: number;
  active_monitoring: number;
}

export interface HeartRateTrend {
  day: string;
  avg_hr: number;
}

export interface RecentRecording {
  id: number;
  patient_name: string;
  patient_age: number;
  timestamp: string;
  heart_rate: number;
  status: string;
  duration: number;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  created_at?: string;
}

export interface Recording {
  id: number;
  patient_id: number;
  patient_name: string;
  timestamp: string;
  ecg_value: number;
  pcg_value: number;
  heart_rate: number;
  status: string;
  duration: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function getHeartRateTrend(days: number = 7): Promise<HeartRateTrend[]> {
  const res = await fetch(`${API_BASE}/api/dashboard/trend?days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch heart rate trend');
  return res.json();
}

export async function getRecentRecordings(limit: number = 10): Promise<RecentRecording[]> {
  const res = await fetch(`${API_BASE}/api/dashboard/recent?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch recent recordings');
  return res.json();
}

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_BASE}/api/patients`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

export async function createPatient(name: string, age: number): Promise<Patient> {
  const res = await fetch(`${API_BASE}/api/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, age })
  });
  if (!res.ok) throw new Error('Failed to create patient');
  return res.json();
}

export async function getRecordings(patientId?: number, limit: number = 100): Promise<Recording[]> {
  const url = patientId 
    ? `${API_BASE}/api/recordings?patient_id=${patientId}&limit=${limit}` 
    : `${API_BASE}/api/recordings?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch recordings');
  return res.json();
}

export function getExportCSVUrl(patientId?: number, startDate?: string, endDate?: string): string {
  const params = new URLSearchParams();
  if (patientId) params.append('patient_id', patientId.toString());
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  return `${API_BASE}/api/export/csv?${params.toString()}`;
}
