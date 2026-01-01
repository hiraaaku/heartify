'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Zap, Activity, Users, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
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

  return (
    <main className="pt-8 md:pt-12 px-4 md:px-8 pb-12 max-w-6xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Deteksi Dini Stroke, Dimulai dari Jantung Anda
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Heartify adalah sistem inovatif untuk deteksi dini risiko stroke berbasis akuisisi dan analisis dua sinyal fisiologis utama: ECG dan PCG.
        </p>
      </div>

      {/* Welcome Section */}
      <Card className="p-8 md:p-10 mb-16 gradient-medical text-white rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Sambutan dari Tim Pengembang</h2>
        <div className="space-y-4">
          <p className="leading-relaxed">
            Selamat datang di Heartify — sebuah sistem inovatif untuk deteksi dini risiko stroke berbasis akuisisi dan analisis dua sinyal fisiologis utama: Electrocardiogram (ECG) dan Phonocardiogram (PCG).
          </p>
          <p className="leading-relaxed">
            Stroke sering kali muncul tanpa peringatan, tetapi sebagian besar kasusnya dipicu oleh gangguan irama jantung — seperti fibrilasi atrium atau aritmia — yang bisa terdeteksi lebih awal melalui perubahan pola sinyal jantung.
          </p>
          <p className="leading-relaxed">
            Heartify dirancang untuk membantu Anda, keluarga, atau tenaga medis dalam memantau kondisi jantung secara non-invasif, real-time, dan berkelanjutan, tanpa perlu peralatan rumit atau kunjungan ke rumah sakit.
          </p>
        </div>
      </Card>

      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Bagaimana Heartify Bekerja?</h2>
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
          Heartify menggabungkan teknologi kasur cerdas dan stetoskop digital untuk menangkap dua sinyal kunci:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">ECG (Electrocardiogram)</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Elektroda terintegrasi di kasur (area belikat, pinggang, panggul)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Menangkap aktivitas listrik jantung — mendeteksi irama, interval RR, dan anomali gelombang</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">PCG (Phonocardiogram)</h3>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Mikrofon kondensor di ujung stetoskop</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Menangkap suara detak jantung (S1, S2, murmur) — mengidentifikasi kebocoran katup atau getaran abnormal</span>
              </li>
            </ul>
          </Card>
        </div>

        <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
          <h3 className="text-lg font-bold text-foreground mb-4">Teknologi Canggih</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <p>Penguat instrumentasi AD620N (gain 1000x)</p>
            <p>Filter high-pass (0.5 Hz), low-pass (150 Hz), dan notch 50 Hz</p>
            <p>Rangkaian proteksi dengan dioda 1N4148 dan filter RC</p>
            <p>Rangkaian Adder yang menggabungkan ECG + PCG</p>
            <p className="md:col-span-2">STM32 Blue Pill untuk konversi data digital dan transmisi Wi-Fi</p>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">Fitur Utama Heartify</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow rounded-lg">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Real-Time Monitoring</h3>
            <p className="text-sm text-muted-foreground">Tampilkan grafik ECG dan PCG secara langsung di web tanpa delay</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow rounded-lg">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Fitur Record</h3>
            <p className="text-sm text-muted-foreground">Tekan tombol Record untuk menyimpan sesi pemantauan untuk analisis ulang</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow rounded-lg">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Identifikasi Pasien</h3>
            <p className="text-sm text-muted-foreground">Setiap pengguna memiliki akun unik dengan data terkait identitas Anda</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow rounded-lg">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Klasifikasi Otomatis</h3>
            <p className="text-sm text-muted-foreground">Sistem memberikan status Normal atau Abnormal berdasarkan hasil analisis</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow rounded-lg">
            <div className="p-3 bg-red-100 rounded-lg w-fit mb-4">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Akses dari Mana Saja</h3>
            <p className="text-sm text-muted-foreground">Pantau kesehatan jantung dari smartphone, tablet, atau laptop</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow rounded-lg">
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Teknologi Dolphin Echolocation</h3>
            <p className="text-sm text-muted-foreground">Analisis menggunakan metode bio-inspired untuk klasifikasi kondisi jantung</p>
          </Card>
        </div>
      </div>

      {/* Target Users Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">Untuk Siapa Heartify?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground">Lansia yang memantau kesehatan jantung di rumah</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground">Pasien dengan riwayat hipertensi atau aritmia</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground">Keluarga yang ingin memastikan orang tua aman</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground">Tenaga medis yang membutuhkan data pemantauan jangka panjang</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground">Peneliti dan mahasiswa bidang biomedical engineering</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="p-8 md:p-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-center rounded-xl">
        <p className="text-lg text-muted-foreground mb-8 italic leading-relaxed">
          "Deteksi dini bukan hanya tentang teknologi — tapi tentang kesadaran. Heartify hadir untuk menjadikan pemantauan jantung sebagai bagian dari gaya hidup sehat, bukan hanya saat sakit."
        </p>
        <Link href="/record-test">
          <Button className="gradient-medical text-white px-8 py-3 text-lg font-semibold rounded-lg">
            Mulai Monitoring Sekarang
          </Button>
        </Link>
      </Card>
    </main>
  )
}
