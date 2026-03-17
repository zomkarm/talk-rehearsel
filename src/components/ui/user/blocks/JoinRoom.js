'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function JoinRoom() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/practice-sessions/joinable')
        const data = await res.json()
        setSessions(data)
      } catch (err) {
        alert('Failed to load joinable sessions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

return (
    <main className="flex-1 bg-white p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* ================= Header ================= */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-teal-400 to-indigo-600 rounded-full" />
              Join Room
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Access your active or upcoming practice sessions.
            </p>
          </div>

          <Link
            href="/user/practice-sessions"
            className="w-fit px-6 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            Back
          </Link>
        </section>

        {/* ================= Content Stage ================= */}
        <section>
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
              Syncing sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] space-y-3">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No active sessions right now.</p>
              <p className="text-slate-300 text-xs font-medium">Schedule a session or wait for an approved request to appear.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(s => {
                const start = new Date(s.scheduled_at)
                const now = new Date()
                const minsLeft = Math.max(0, Math.floor((start - now) / 60000))

                return (
                  <div
                    key={s.id}
                    className="group border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${s.canJoin ? 'text-teal-600 bg-teal-50' : 'text-slate-400 bg-slate-100'}`}>
                           {s.isHost ? 'Host Access' : 'Participant'}
                         </span>
                         <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                           {s.title}
                         </h3>
                      </div>
                      
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                        <span className="text-slate-400 font-medium">
                          {start.toLocaleDateString()} at {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{s.duration_minutes} min</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="uppercase tracking-widest text-[9px] font-black">{s.mode}</span>
                      </p>

                      {!s.canJoin && !s.hasEnded && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 animate-pulse">
                          Starts in {minsLeft} min
                        </p>
                      )}

                      {s.hasEnded && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Session ended
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex justify-end">
                      {s.canJoin ? (
                        <a
                          href={s.room_link}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full md:w-fit px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gradient-to-br hover:from-teal-500 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-slate-100 active:scale-95 flex items-center justify-center"
                        >
                          {s.isHost ? 'Open Room' : 'Join Room'}
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full md:w-fit px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50"
                        >
                          {s.hasEnded ? 'Ended' : 'Not Started'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
