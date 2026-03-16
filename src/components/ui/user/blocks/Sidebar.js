import { useState } from 'react'
import { Home, Trash2, AudioLines, Video, Scroll, Command, MessageSquareText, ChevronLeft, ChevronRight, X, Settings, PanelLeft,PanelRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/user/dashboard' },
    { name: 'Talk Rehearsal', icon: AudioLines, href: '/tkh' },
    { name: 'Interview Studio', icon: MessageSquareText, href: '/user/interview-studio' },
    { name: 'Unscripted Practice', icon: Scroll, href: '/user/unscripted-practice' },
    { name: 'Recordings', icon: Video, href: '/user/recordings' },
    { name: 'Practice Sessions', icon: Command, href: '/user/practice-sessions' },
    { name: 'Settings', icon: Settings, href: '/user/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop - Closes sidebar when clicking outside */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out border-r border-indigo-100
          bg-indigo-50 shadow-xl md:static
          ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full relative p-4">
          
          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-indigo-200 
                       rounded-full items-center justify-center text-indigo-600 hover:bg-indigo-600 
                       hover:text-white transition-colors shadow-sm z-10"
          >
            {isCollapsed ? <PanelRight size={14} /> : <PanelLeft size={14} />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute right-4 top-5 text-slate-400 hover:text-indigo-600"
          >
            <X size={20} />
          </button>

          {/* Logo Section */}
          <div className={`flex items-center gap-3 mb-10 overflow-hidden ${isCollapsed ? 'md:justify-center' : 'px-2'}`}>
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
              <AudioLines className="text-white" size={22} />
            </div>
            {(!isCollapsed || sidebarOpen) && (
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-teal-500 bg-clip-text text-transparent truncate">
                TalkRehearsel
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto no-scrollbar">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href; // Check if active

                return (
                  <li key={item.name} className="relative">
                    <a
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-100/80 text-indigo-700 shadow-sm' // Active Style
                          : 'text-slate-600 hover:bg-white/50 hover:text-indigo-600' // Inactive/Hover Style
                        }
                        ${isCollapsed ? 'md:justify-center px-3 md:px-0' : ''}`}
                      title={isCollapsed ? item.name : ''}
                    >
                      
                      <item.icon 
                        size={18} 
                        className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                      />
                      
                      {(!isCollapsed || sidebarOpen) && (
                        <span className={`font-medium text-sm whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>
                          {item.name}
                        </span>
                      )}

                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Footer */}
          <div className={`mt-auto pt-4 border-t border-slate-100 ${isCollapsed ? 'md:text-center' : 'px-2'}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'md:justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-white shadow-sm flex-shrink-0" />
              {(!isCollapsed || sidebarOpen) && (
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 truncate"></p>
                  <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider"></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}