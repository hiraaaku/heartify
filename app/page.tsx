'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (auth) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center gradient-medical">
      <Loader className="w-8 h-8 text-white animate-spin" />
    </div>
  )
}
