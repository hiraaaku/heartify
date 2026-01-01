'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (username === 'admin' && password === 'password123') {
      localStorage.setItem('auth', JSON.stringify({ username, authenticated: true, timestamp: Date.now() }))
      router.push('/dashboard')
    } else {
      setError('Username atau password salah. Gunakan: admin / password123')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen gradient-medical flex flex-col items-center justify-center p-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 gradient-medical opacity-50"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Heartify</h1>
          <p className="text-white/80">Sistem Deteksi Dini Stroke Berbasis Sinyal Jantung</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-medical text-white font-medium py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-foreground font-medium mb-2">Demo Credentials:</p>
            <p className="text-sm text-muted-foreground"><strong>Username:</strong> admin</p>
            <p className="text-sm text-muted-foreground"><strong>Password:</strong> password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
