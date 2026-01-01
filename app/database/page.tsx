'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Search } from 'lucide-react'

const mockDatabaseRecords = [
  { id: 1, name: 'Budi Santoso', timestamp: '2024-11-15 10:30:00', ecg: 52.34, pcg: 41.22, hr: 72, status: 'Normal' },
  { id: 2, name: 'Siti Rahma', timestamp: '2024-11-15 11:15:00', ecg: 61.45, pcg: 38.90, hr: 85, status: 'Normal' },
  { id: 3, name: 'Ahmad Wijaya', timestamp: '2024-11-15 12:00:00', ecg: 71.23, pcg: 45.67, hr: 95, status: 'Abnormal' },
  { id: 4, name: 'Lisa Mawaddah', timestamp: '2024-11-15 13:30:00', ecg: 48.90, pcg: 39.12, hr: 70, status: 'Normal' },
  { id: 5, name: 'Budi Santoso', timestamp: '2024-11-14 14:20:00', ecg: 55.67, pcg: 42.34, hr: 73, status: 'Normal' },
  { id: 6, name: 'Rudi Hermawan', timestamp: '2024-11-14 15:10:00', ecg: 68.90, pcg: 44.56, hr: 102, status: 'Abnormal' },
  { id: 7, name: 'Maya Kusuma', timestamp: '2024-11-14 16:45:00', ecg: 50.12, pcg: 40.78, hr: 68, status: 'Normal' },
  { id: 8, name: 'Eka Putri', timestamp: '2024-11-13 09:20:00', ecg: 54.56, pcg: 41.89, hr: 75, status: 'Normal' },
]

export default function DatabasePage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (!auth) {
      router.push('/login')
    } else {
      setIsAuthed(true)
    }
  }, [router])

  const filteredRecords = mockDatabaseRecords.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || record.timestamp.startsWith(dateFilter)
    return matchesSearch && matchesDate
  })

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Pasien', 'Timestamp', 'ECG Value', 'PCG Value', 'Heart Rate', 'Status']
    const rows = filteredRecords.map((record) => [
      record.id,
      record.name,
      record.timestamp,
      record.ecg,
      record.pcg,
      record.hr,
      record.status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'heartify_data.csv'
    a.click()
  }

  if (!isAuthed) return null

  return (
    <main className="pt-20 md:pt-0 p-4 md:p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Data Rekaman Lengkap</h1>
        <p className="text-muted-foreground mt-2">Kelola dan export semua data rekaman ECG & PCG</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama pasien..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Export Button */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={handleExportCSV}
          className="gradient-medical text-white font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download as CSV
        </Button>
      </div>

      {/* Data Table */}
      <Card className="p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Nama Pasien</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">ECG Value</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">PCG Value</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Heart Rate</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{record.id}</td>
                  <td className="py-3 px-4 text-foreground">{record.name}</td>
                  <td className="py-3 px-4 text-foreground text-sm">{record.timestamp}</td>
                  <td className="py-3 px-4 text-foreground">{record.ecg.toFixed(2)}</td>
                  <td className="py-3 px-4 text-foreground">{record.pcg.toFixed(2)}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  Tidak ada data yang sesuai dengan pencarian Anda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Records Count */}
      <div className="mt-4 text-sm text-muted-foreground">
        Menampilkan {filteredRecords.length} dari {mockDatabaseRecords.length} rekaman
      </div>
    </main>
  )
}
