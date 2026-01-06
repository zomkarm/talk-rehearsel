'use client'
import { useState } from 'react'
import Sidebar from '@/components/ui/user/blocks/Sidebar';
import RecordingsPage from '@/components/ui/user/blocks/RecordingsPage';
import Header from '@/components/ui/user/blocks/Header';

export default function RecordingsLayout(){
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

              <RecordingsPage   />
            </div>
          </div>
    );
}