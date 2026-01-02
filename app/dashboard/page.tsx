'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Activity, Users, Radio, Heart, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  getDashboardStats, 
  getHeartRateTrend, 
  getRecentRecordings,
  DashboardStats,
  HeartRateTrend,
  RecentRecording
} from '@/lib/api'
import { format } from 'date-fns'

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [trend, setTrend] = useState<HeartRateTrend[]>([])
  const [recordings, setRecordings] = useState<RecentRecording[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (!auth) {
      router.push('/login')
    } else {
      setIsAuthed(true)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthed) return

    const fetchData = async () => {
      try {
        const [statsData, trendData, recordingsData] = await Promise.all([
          getDashboardStats(),
          getHeartRateTrend(),
          getRecentRecordings()
        ])
        setStats(statsData)
        setTrend(trendData)
        setRecordings(recordingsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthed])

  if (!isAuthed) return null

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>
  }

  const summaryCards = [
    { label: 'Total Pasien', value: stats?.total_patients || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Total Rekaman', value: stats?.total_recordings || 0, icon: Radio, color: 'text-purple-500' },
    { label: 'Rata-rata HR', value: `${stats?.avg_heart_rate?.toFixed(0) || 0} BPM`, icon: Heart, color: 'text-red-500' },
    { label: 'Status Terakhir', value: stats?.latest_status || '-', icon: TrendingUp, color: 'text-green-500' },
  ]

  return (
    <main className="pt-20 md:pt-0 p-4 md:p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground pt-4">Rangkuman Monitoring Pasien</h1>
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
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tickFormatter={(value) => format(new Date(value), 'dd MMM')}
              />
              <YAxis />
              <Tooltip labelFormatter={(value) => format(new Date(value), 'dd MMM yyyy')} />
              <Line type="monotone" dataKey="avg_hr" stroke="oklch(0.28 0.15 260)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Statistik Pasien</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Pasien Normal</span>
              <span className="text-xl font-bold text-green-600">{stats?.normal_count || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Pasien Abnormal</span>
              <span className="text-xl font-bold text-red-600">{stats?.abnormal_count || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Monitoring Aktif</span>
              <span className="text-xl font-bold text-blue-600">{stats?.active_monitoring || 0}</span>
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
                <th className="text-left py-3 px-4 font-semibold text-foreground">Waktu</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Durasi</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">HR</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((record) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{record.patient_name}</td>
                  <td className="py-3 px-4 text-foreground">{record.patient_age}</td>
                  <td className="py-3 px-4 text-foreground">
                    {format(new Date(record.timestamp), 'dd MMM HH:mm')}
                  </td>
                  <td className="py-3 px-4 text-foreground">{Math.floor(record.duration / 60)} min</td>
                  <td className="py-3 px-4 text-foreground font-semibold">{record.heart_rate} BPM</td>
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
