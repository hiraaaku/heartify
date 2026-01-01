'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Users, Radio, Heart, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data
const mockChartData = [
  { date: 'Day 1', hr: 72 },
  { date: 'Day 2', hr: 75 },
  { date: 'Day 3', hr: 70 },
  { date: 'Day 4', hr: 78 },
  { date: 'Day 5', hr: 76 },
  { date: 'Day 6', hr: 74 },
  { date: 'Day 7', hr: 77 },
]

const mockRecordings = [
  { id: 1, name: 'Budi Santoso', age: 45, date: '2024-11-15', duration: '5 min', hr: 72, status: 'Normal' },
  { id: 2, name: 'Siti Rahma', age: 52, date: '2024-11-14', duration: '5 min', hr: 85, status: 'Normal' },
  { id: 3, name: 'Ahmad Wijaya', age: 58, date: '2024-11-13', duration: '5 min', hr: 95, status: 'Abnormal' },
  { id: 4, name: 'Lisa Mawaddah', age: 48, date: '2024-11-12', duration: '5 min', hr: 70, status: 'Normal' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (!auth) {
      router.push('/login')
    } else {
      setIsAuthed(true)
    }
  }, [router])

  if (!isAuthed) return null

  const summaryCards = [
    { label: 'Total Pasien', value: '24', icon: Users, color: 'text-blue-500' },
    { label: 'Total Rekaman', value: '156', icon: Radio, color: 'text-purple-500' },
    { label: 'Rata-rata HR', value: '75 BPM', icon: Heart, color: 'text-red-500' },
    { label: 'Status Terakhir', value: 'Normal', icon: TrendingUp, color: 'text-green-500' },
  ]

  return (
    <main className="pt-20 md:pt-0 p-4 md:p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Rangkuman Monitoring Pasien</h1>
        <p className="text-muted-foreground mt-2">Lihat status kesehatan pasien Anda secara real-time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tren Heart Rate (7 Hari Terakhir)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hr" stroke="oklch(0.28 0.15 260)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Statistik Pasien</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Pasien Normal</span>
              <span className="text-xl font-bold text-green-600">22</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Pasien Abnormal</span>
              <span className="text-xl font-bold text-red-600">2</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Monitoring Aktif</span>
              <span className="text-xl font-bold text-blue-600">8</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recordings Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Riwayat Rekaman Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Nama Pasien</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Usia</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Tanggal</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Durasi</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">HR</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRecordings.map((record) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{record.name}</td>
                  <td className="py-3 px-4 text-foreground">{record.age}</td>
                  <td className="py-3 px-4 text-foreground">{record.date}</td>
                  <td className="py-3 px-4 text-foreground">{record.duration}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">{record.hr} BPM</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'Normal'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
