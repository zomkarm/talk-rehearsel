'use client'
import { useState } from 'react'
import Sidebar from '@/components/ui/admin/blocks/Sidebar'
import Header from '@/components/ui/admin/blocks/Header'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex bg-gradient-to-b from-gray-200 via-gray-50 to-white h-screen text-gray-800 font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          {children}
      </div>
    </div>
  )
}
