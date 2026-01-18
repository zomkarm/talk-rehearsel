import { useState, useEffect } from 'react'
import { Home, Trash2, Users, Laptop, School, Star, Receipt, AudioLines, Video, Scroll, Command } from 'lucide-react'

//const starredPages = [{id:1,title:'Sample1'},{id:2,title:'Sample2'}]

export default function Sidebar({ sidebarOpen, setSidebarOpen}) {
  const [loading, setLoading] = useState(true)

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 
                  bg-gradient-to-br from-indigo-100 to-purple-200
                  p-5 shadow-sm z-50 
                  transform transition-transform duration-300 
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                  md:translate-x-0 md:static md:flex`}
                >
      <div className="flex flex-col h-full w-full">
        {/* Top 50% */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo + Close Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-extrabold tracking-wide 
                            bg-gradient-to-r from-teal-500 to-indigo-600 
                            bg-clip-text text-transparent drop-shadow-sm">
              TalkRehearsel
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-indigo-600 focus:outline-none"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="text-sm font-medium">
            <ul className="space-y-1.5">
              <li>
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Home size={18} strokeWidth={2} /> Home
                </a>
              </li>

               <li>
                <a
                  href="/tkh"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <AudioLines size={18} strokeWidth={2} /> Talk Rehearsel
                </a>
              </li>

              <li>
                <a
                  href="/unscripted-practice"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Scroll size={18} strokeWidth={2} /> Unscripted Practice
                </a>
              </li>

              <li>
                <a
                  href="/recordings"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Video size={18} strokeWidth={2} /> Recordings
                </a>
              </li>

               <li>
                <a
                  href="/practice-sessions"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Command size={18} strokeWidth={2} /> Practice Sessions
                </a>
              </li>

              {/*<li>
                <a
                  href="/billing"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Receipt size={18} strokeWidth={2} /> Billing
                </a>
              </li>*/}

              <li>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Trash2 size={18} strokeWidth={2} /> Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>


      </div>
    </aside>
  )
}
