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
    <header className="flex items-center justify-between px-8 py-2 bg-white border-b border-indigo-50 sticky top-0 z-30 transition-all duration-300">
      
      <div className="flex items-center gap-4">
        {/* Sidebar toggle - Mobile only */}
        <button
          onClick={props.toggleSidebar}
          className="md:hidden p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none"
        >
          <Menu size={20} />
        </button>

        {/* Workspace title - More elegant Typography */}
        <div className="flex flex-col">
          <h1 className="text-sm font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            My Workspace
          </h1>
          <p className="hidden sm:block text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            TalkRehearsel Studio
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        
        {/* Optional: Add a subtle notification or search icon here for balance */}

        {/* Profile Section */}
        <div className="relative" ref={dropdownRef}>
          <div className="p-0.5 rounded-full border-2 border-transparent hover:border-indigo-100 transition-all cursor-pointer">
            <img
              onClick={() => setProfileModal(prev => !prev)}
              src={profile?.profile_pic ? `/profile_pics/${profile.profile_pic}` : '/profile.jpg'}
              alt="Profile"
              className="w-9 h-9 rounded-full transition object-cover shadow-sm"
            />
          </div>

          {profileModal && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-indigo-50 
                            rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-5 py-4 bg-gradient-to-br from-white to-indigo-50/30 border-b border-indigo-50">
                <p className="text-sm font-bold text-slate-800">{profile?.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{profile?.email || 'user@example.com'}</p>
              </div>
              
              <ul className="p-2 text-sm text-slate-600">
                <li
                  className="flex items-center px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg cursor-pointer transition-colors"
                  onClick={() => router.push('/user/settings')}
                >
                  My Account
                </li>
                <li
                  className="flex items-center px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg cursor-pointer transition-colors"
                  onClick={() => router.push('/help')}
                >
                  Help Center
                </li>
                <div className="my-1 border-t border-slate-50" />
                <li
                  className="flex items-center px-3 py-2.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors font-medium"
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