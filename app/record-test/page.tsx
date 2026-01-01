'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Download, Trash2 } from 'lucide-react'

// Generate mock signal data
const generateSignalData = () => {
  const data = []
  for (let i = 0; i < 100; i++) {
    data.push({
      time: i,
      ecg: 50 + 30 * Math.sin(i * 0.1) + Math.random() * 5,
      pcg: 40 + 20 * Math.cos(i * 0.15) + Math.random() * 3,
    })
  }
  return data
}

export default function RecordTestPage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [duration, setDuration] = useState(0)
  const [ecgData, setEcgData] = useState(generateSignalData())
  const [pcgData, setPcgData] = useState(generateSignalData())
  const [heartRate, setHeartRate] = useState(72)
  const [status, setStatus] = useState<'normal' | 'abnormal'>('normal')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const durationRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (!auth) {
      router.push('/login')
    } else {
      setIsAuthed(true)
    }
  }, [router])

  // Auto-refresh signals every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (recording) {
        setEcgData((prev) => {
          const newData = [...prev.slice(1), {
            time: prev[prev.length - 1].time + 1,
            ecg: 50 + 30 * Math.sin((prev[prev.length - 1].time + 1) * 0.1) + Math.random() * 5,
            pcg: 40 + 20 * Math.cos((prev[prev.length - 1].time + 1) * 0.15) + Math.random() * 3,
          }]
          return newData
        })
        
        setPcgData((prev) => {
          const newData = [...prev.slice(1), {
            time: prev[prev.length - 1].time + 1,
            ecg: 50 + 30 * Math.sin((prev[prev.length - 1].time + 1) * 0.1) + Math.random() * 5,
            pcg: 40 + 20 * Math.cos((prev[prev.length - 1].time + 1) * 0.15) + Math.random() * 3,
          }]
          return newData
        })

        const newHR = 60 + Math.random() * 40
        setHeartRate(Math.round(newHR))
        setStatus(newHR < 60 || newHR > 100 ? 'abnormal' : 'normal')
      }
    }, 500)

    return () => clearInterval(interval)
  }, [recording])

  const handleStartRecording = () => {
    setRecording(true)
    setRecordingComplete(false)
    durationRef.current = 0
    timerRef.current = setInterval(() => {
      durationRef.current += 1
      setDuration(durationRef.current)
    }, 1000)
  }

  const handleStopRecording = () => {
    setRecording(false)
    setRecordingComplete(true)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleSaveToDatabase = () => {
    setShowSuccessModal(true)
    setTimeout(() => {
      setShowSuccessModal(false)
      setRecordingComplete(false)
      setDuration(0)
      setEcgData(generateSignalData())
      setPcgData(generateSignalData())
    }, 2000)
  }

  const handleDiscardRecording = () => {
    setRecordingComplete(false)
    setDuration(0)
    setEcgData(generateSignalData())
    setPcgData(generateSignalData())
  }

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('id-ID', options)
  }

  if (!isAuthed) return null

  return (
    <main className="pt-20 md:pt-0 p-4 md:p-8">
      {/* Page Title */}
      <div className="mb-8 pt-20 md:pt-0">
        <h1 className="text-3xl font-bold text-foreground">Record Test</h1>
        <p className="text-muted-foreground mt-2">Monitoring real-time ECG dan PCG signal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-blue-600 font-semibold mb-1">Nama Pasien</p>
          <p className="text-lg font-bold text-blue-900">Budi Santoso</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-sm text-purple-600 font-semibold mb-1">Usia</p>
          <p className="text-lg font-bold text-purple-900">45 Tahun</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-green-600 font-semibold mb-1">Tanggal</p>
          <p className="text-lg font-bold text-green-900">{getFormattedDate()}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <p className="text-sm text-orange-600 font-semibold mb-1">Waktu Pemeriksaan</p>
          <p className="text-lg font-bold text-orange-900">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
        </Card>
      </div>

      {/* Live Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">ECG Waveform</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ecgData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ecg" stroke="oklch(0.28 0.15 260)" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">PCG Waveform</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={pcgData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pcg" stroke="oklch(0.45 0.12 260)" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Heart Rate</p>
          <p className="text-4xl font-bold text-primary">{heartRate}</p>
          <p className="text-sm text-muted-foreground mt-1">BPM</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Status Monitoring</p>
          <p className={`text-2xl font-bold ${status === 'normal' ? 'text-green-600' : 'text-red-600'}`}>
            {status === 'normal' ? 'Normal' : 'Abnormal'}
          </p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Durasi</p>
          <p className="text-4xl font-bold text-primary">{String(duration).padStart(2, '0')}:00</p>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="p-8 text-center">
        <div className="mb-6">
          <p className="text-muted-foreground mb-2">Recording Duration</p>
          <p className="text-4xl font-bold text-primary">{String(duration).padStart(2, '0')}:00</p>
        </div>
        
        {!recordingComplete ? (
          <Button
            onClick={recording ? handleStopRecording : handleStartRecording}
            className={`px-8 py-3 text-white font-semibold rounded-lg transition-all ${
              recording
                ? 'gradient-medical hover:opacity-90'
                : 'gradient-medical hover:opacity-90'
            }`}
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSaveToDatabase}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Save To Database
            </Button>
            <Button
              onClick={handleDiscardRecording}
              variant="outline"
              className="px-8 py-3 font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Discard
            </Button>
          </div>
        )}
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pt-20 md:pt-0">
          <Card className="p-8 max-w-md text-center">
            <p className="text-2xl font-bold text-green-600 mb-2">✓ Data Saved</p>
            <p className="text-muted-foreground">Rekaman berhasil disimpan ke database</p>
          </Card>
        </div>
      )}
    </main>
  )
}
