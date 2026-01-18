'use client'
import { useState } from 'react'
import Sidebar from '@/components/ui/user/blocks/Sidebar';
import MySessions from '@/components/ui/user/blocks/MySessions';
import Header from '@/components/ui/user/blocks/Header';

export default function MySessionsLayout(){
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }
  
  return (
      <div className="flex bg-gradient-to-br from-indigo-100 to-purple-200 h-screen text-gray-800 font-sans">
            

            {/* Sidebar sidebarOpen */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              
              {/* Header */}
              <Header toggleSidebar={toggleSidebar} />

              <MySessions />
            </div>
          </div>
    );
}