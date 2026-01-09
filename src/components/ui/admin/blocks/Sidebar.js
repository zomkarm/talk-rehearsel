import { Home, Trash2, Users, Laptop, School, BrickWall, CircleDollarSign, MessageCircleCode, Rss, CreditCard, Store, AudioLines } from 'lucide-react'

export default function Sidebar({ sidebarOpen, setSidebarOpen}) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 
                  bg-gradient-to-b from-gray-200 via-gray-50 to-white 
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
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Home size={18} strokeWidth={2} /> Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin/users"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Users size={18} strokeWidth={2} /> Users
                </a>
              </li>
              <li>
                <a
                  href="/admin/talkrehearsel"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <AudioLines size={18} strokeWidth={2} /> Talk Rehearsel
                </a>
              </li>
              <li>
                <a
                  href="/admin/unscripted-practice"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <AudioLines size={18} strokeWidth={2} /> Unscripted Practice
                </a>
              </li>
              <li>
                <a
                  href="/admin/pricing"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <CreditCard size={18} strokeWidth={2} /> Pricings
                </a>
              </li>
              <li>
                <a
                  href="/admin/subscriptions"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <Rss size={18} strokeWidth={2} /> Subscriptions
                </a>
              </li>
              <li>
                <a
                  href="/admin/payments"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <CircleDollarSign size={18} strokeWidth={2} /> Payments
                </a>
              </li>
              <li>
                <a
                  href="/admin/contact"
                  className="flex items-center gap-2 px-3 py-2 rounded-md 
                             text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 
                             hover:font-semibold transition"
                >
                  <MessageCircleCode size={18} strokeWidth={2} /> Help and Feedback
                </a>
              </li>
              <li>
                <a
                  href="/admin/setting"
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
