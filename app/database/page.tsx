'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Search } from 'lucide-react'
import { getRecordings, getExportCSVUrl, Recording } from '@/lib/api'
import { format } from 'date-fns'

export default function DatabasePage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [records, setRecords] = useState<Recording[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
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

    const fetchRecords = async () => {
      try {
        const data = await getRecordings(undefined, 1000) // Fetch up to 1000 records
        setRecords(data)
      } catch (error) {
        console.error('Failed to fetch recordings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [isAuthed])

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || record.timestamp.startsWith(dateFilter)
    return matchesSearch && matchesDate
  })

  const handleExportCSV = () => {
    // Redirect to the API export endpoint
    const url = getExportCSVUrl(undefined, dateFilter, dateFilter)
    window.open(url, '_blank')
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
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading records...</div>
        ) : (
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
                    <td className="py-3 px-4 text-foreground">{record.patient_name}</td>
                    <td className="py-3 px-4 text-foreground text-sm">
                      {format(new Date(record.timestamp), 'dd MMM yyyy HH:mm:ss')}
                    </td>
                    <td className="py-3 px-4 text-foreground">{record.ecg_value.toFixed(2)}</td>
                    <td className="py-3 px-4 text-foreground">{record.pcg_value.toFixed(2)}</td>
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
        )}
      </Card>

      {/* Records Count */}
      <div className="mt-4 text-sm text-muted-foreground">
        Menampilkan {filteredRecords.length} dari {records.length} rekaman
      </div>
    </main>
  )
}
