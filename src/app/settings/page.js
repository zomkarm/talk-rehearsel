'use client'
import { useState } from 'react'
import Sidebar from '@/components/ui/user/blocks/Sidebar';
import SettingsPage from '@/components/ui/user/blocks/SettingsPage';
import Header from '@/components/ui/user/blocks/Header';

export default function SettingsLayout(){
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }
  
  return (
      <div className="flex bg-gradient-to-b from-gray-200 via-gray-50 to-white h-screen text-gray-800 font-sans">
            

            {/* Sidebar sidebarOpen */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              
              {/* Header */}
              <Header toggleSidebar={toggleSidebar} />

              <SettingsPage   />
            </div>
          </div>
    );
}