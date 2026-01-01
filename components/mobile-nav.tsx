'use client'

import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from './sidebar'

interface MobileNavProps {
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}

export function MobileNav({ sidebarOpen, onSidebarOpenChange }: MobileNavProps) {
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 gradient-medical flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-white">Heartify</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSidebarOpenChange(!sidebarOpen)}
          className="text-white hover:bg-white/20"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 pt-16"
            onClick={() => onSidebarOpenChange(false)}
          />
          {/* Sidebar Content */}
          <div className="md:hidden fixed top-16 left-0 bottom-0 w-64 z-40 overflow-y-auto">
            <Sidebar onClose={() => onSidebarOpenChange(false)} />
          </div>
        </>
      )}
    </>
  )
}
