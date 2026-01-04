'use client'
import { useState, useEffect, useRef } from 'react'
import { Settings,BadgeQuestionMark,Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useGlobalStore } from '@/store/globalStore'

export default function Header(props) {
	const [profileModal,setProfileModal] = useState(false)
	const router = useRouter()
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileModal(false)
      }
    }
    if (profileModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileModal])


	const logout = async () => {
    showLoader("Logging Out...")
    try{
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/auth/admin/signin')
    } catch(err){
      console.error('Error at Logout:', err)
    } finally{
      hideLoader()
    }
  }

	return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b rounded-bl-3xl shadow-sm">
      {/* Sidebar toggle */}
      <button
        onClick={props.toggleSidebar}
        className="md:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
      >
        <Menu size={16} />
      </button>

      {/* Workspace title */}
      <div className="text-base font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
        Admin Panel
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">

        <button className="text-gray-500 hover:text-indigo-600 px-2 py-2 rounded focus:outline-none">
          <Settings size={16} />
        </button>
        <button className="text-gray-500 hover:text-indigo-600 px-2 py-2 rounded focus:outline-none">
          <BadgeQuestionMark size={16} />
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <img
            onClick={() => setProfileModal(prev => !prev)}
            src="/profile.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-indigo-500 transition"
          />
          {profileModal && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 
                            rounded-xl shadow-lg z-20 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
              <ul className="text-sm text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {/* navigate to account */}}
                >
                  My Account
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
	);
}