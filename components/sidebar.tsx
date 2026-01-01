'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Activity, Database, LogOut, Heart, ChevronLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface SidebarProps {
  onClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/record-test', label: 'Record Test', icon: Activity },
    { href: '/database', label: 'Database', icon: Database },
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth')
    router.push('/login')
  }

  return (
    <div className={`gradient-medical flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Heartify</h1>
              <p className="text-xs text-white/70">Deteksi Dini</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {typeof onToggleCollapse === 'function' && (
        <div className="hidden md:flex justify-end p-2 border-b border-white/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <button
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-white/20">
        <Button
          onClick={handleLogout}
          className={`w-full text-white bg-white/10 hover:bg-white/20 transition-colors rounded-lg ${
            isCollapsed ? 'p-2' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
