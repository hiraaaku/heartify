'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { MobileNav } from '@/components/mobile-nav'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const auth = localStorage.getItem('auth')
    const isAuth = !!auth
    setIsAuthenticated(isAuth)

    if (!isAuth && pathname !== '/login') {
      router.push('/login')
    }
  }, [pathname, router])

  if (!isClient) {
    return null
  }

  const showLayout = isAuthenticated && pathname !== '/login'

  return (
    <>
      {showLayout ? (
        <div className="flex h-screen overflow-hidden w-full">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar 
              onClose={() => setSidebarOpen(false)}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          {/* Mobile Navigation */}
          <MobileNav sidebarOpen={sidebarOpen} onSidebarOpenChange={setSidebarOpen} />

          {/* Main Content */}
          <main className={`flex-1 overflow-auto w-full pt-16 md:pt-0 transition-all duration-300 ${
            sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}>
            {children}
          </main>
        </div>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  )
}
