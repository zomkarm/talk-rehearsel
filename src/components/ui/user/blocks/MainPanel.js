'use client'

import { useEffect, useState } from 'react'
import {
  Mic,
  Headphones,
  Theater,
  Clock,
  CheckCircle2,
  AudioLines
} from 'lucide-react'

export default function MainPanel() {
  const [stats, setStats] = useState({
    situations: 0,
    recordings: 0,
    practiceMinutes: 0,
    recentActivity: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/talkrehearsel/dashboard')
        const data = await res.json()
        setStats(data)
        console.log(stats)
      } catch (err) {
        console.error('Failed to load dashboard stats', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  return (
<main className="flex-1 bg-white p-8 overflow-y-auto space-y-8">
  {/* Header with Glass Effect */}
  <section className="flex justify-between items-end border-b border-slate-200/60 pb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
      <p className="text-slate-500 text-sm">Elevate your communication practice.</p>
    </div>
    <div className="hidden md:block text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
      Studio Status: <span className="text-teal-500">Ready</span>
    </div>
  </section>

  {/* Modern Bento Stats */}
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Situations - Indigo Focus */}
    <div className="relative group bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Theater size={20} />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Practice Hub</h3>
      </div>
      <p className="text-3xl font-bold text-slate-900">{loading ? '—' : stats.situations}</p>
      <p className="text-xs font-semibold text-indigo-600/70 mt-1">Unique Situations</p>
    </div>

    {/* Recordings - Teal Focus */}
    <div className="relative group bg-white border border-teal-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-teal-50 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
          <Mic size={20} />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Audio Library</h3>
      </div>
      <p className="text-3xl font-bold text-slate-900">{loading ? '—' : stats.recordings}</p>
      <p className="text-xs font-semibold text-teal-600/70 mt-1">Voice Recorded</p>
    </div>

    {/* Completed - Mixed Glow */}
    <div className="relative group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <CheckCircle2 size={20} />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Milestones</h3>
      </div>
      <p className="text-3xl font-bold text-slate-900">{loading ? '—' : stats.situations}</p>
      <p className="text-xs font-semibold text-slate-500 mt-1">Conversations Finalized</p>
    </div>
  </section>

  {/* Activity Feed with Studio Aesthetics */}
  <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Headphones size={18} className="text-indigo-500" />
        <h2 className="text-sm font-bold text-slate-800">Recent Rehearsals</h2>
      </div>
      <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
    </div>

    <div className="p-6">
      {stats.recentActivity.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">Waiting for your first session...</p>
      ) : (
        <div className="space-y-6">
          {stats.recentActivity.map((item, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {i + 1}
                </div>
                {i !== stats.recentActivity.length - 1 && <div className="w-px h-full bg-slate-100 my-1" />}
              </div>
              <div className="pb-4">
                <h4 className="text-[13px] font-bold text-slate-800 tracking-tight">{item.situationTitle}</h4>
                <div className="mt-1.5 px-4 py-2 bg-slate-50 rounded-r-xl rounded-bl-xl border-l-2 border-teal-500">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    <span className="text-[10px] uppercase text-teal-600 font-bold mr-1">{item.actorName}:</span> 
                    “{item.lineText}”
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>

  {/* Footer Callout */}
  <div className="rounded-2xl bg-indigo-600 p-[1px] shadow-lg shadow-indigo-100">
    <div className="bg-white rounded-[15px] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <AudioLines size={24} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Ready to break the script?</h3>
          <p className="text-xs text-slate-500 mt-0.5">Select a practice module to begin your rehearsal.</p>
        </div>
      </div>
      <button className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
        Start Practicing
      </button>
    </div>
  </div>
</main>
  )
}
