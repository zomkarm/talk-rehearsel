'use client'
import { useState, useEffect, useRef } from 'react'
import { Settings,BadgeQuestionMark,Menu,Crown, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useGlobalStore } from '@/store/globalStore'

export default function Header(props) {
	const [profileModal,setProfileModal] = useState(false)
  const [profile, setProfile] = useState(null)
	const router = useRouter()
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)
  const dropdownRef = useRef(null)
  const [plan, setPlan] = useState('Free')

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [])


  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch('/api/subscription/status', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        if (data.status && data.status !== 'FREE') {
          setPlan('Pro')
        } else {
          setPlan('Free')
        }
      } catch (err) {
        console.error('Error fetching subscription:', err)
      }
    }
    fetchPlan()
  }, [])


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
    showLoader("Logging out...")
    try{
      await fetch('/api/logout', { method: 'POST' })
      router.push('/login')
    } catch(err){
      console.error('Error at Logout:', err)
    } /*finally{
      hideLoader()
    }*/
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
        My Workspace
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Plan badge */}
        {/*
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm
            ${plan === 'Pro'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          {plan === 'Pro' ? (
            <>
              <Crown size={14} className="shrink-0" />
              <a href="/pricing">Premium</a>
            </>
          ) : (
            <>
              <User size={14} className="shrink-0" />
              <a href="/pricing">Basic</a>
            </>
          )}
        </span>*/}

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
         <img
            onClick={() => setProfileModal(prev => !prev)}
            src={profile?.profile_pic ? `/profile_pics/${profile.profile_pic}` : '/profile.jpg'}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-indigo-500 transition object-cover"
          />

          {profileModal && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 
                            rounded-xl shadow-lg z-20 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{profile?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{profile?.email || ''}</p>
              </div>
              <ul className="text-sm text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    router.push('/settings')
                  }}
                >
                  My Account
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    router.push('/help')
                  }}
                >
                  Help
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