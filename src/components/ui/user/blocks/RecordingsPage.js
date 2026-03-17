'use client'

import { useEffect, useRef, useState } from 'react'
import { Headphones, Play, Loader2, Trash2, Search, MicOff, Square } from 'lucide-react'

export default function RecordingsPage() {
  const [situations, setSituations] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingSituationId, setPlayingSituationId] = useState(null)

  // separate states (this fixes search)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const audioRef = useRef(null)

  /* --------------------------------
     Debounce search (CORRECT)
  --------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput)
      setPage(1)
    }, 400)

    return () => clearTimeout(t)
  }, [searchInput])

  /* --------------------------------
     Fetch situations
  --------------------------------- */
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/talkrehearsel/recordings?search=${searchQuery}&page=${page}`
        )
        const data = await res.json()

        setSituations(data.situations || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        console.error('Failed to load recordings', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, page])

  /* --------------------------------
     Playback Logic
  --------------------------------- */
  async function playConversation(group) {
    if (playingSituationId === group.situation.id) {
      audioRef.current?.pause()
      setPlayingSituationId(null)
      return
    }

    setPlayingSituationId(group.situation.id)

    const res = await fetch(
      `/api/talkrehearsel/conversations/${group.situation.id}`
    )
    const data = await res.json()

    const timeline = data.conversation
      .filter(turn => turn.audio?.src)
      .map(turn => turn.audio.src)

    let index = 0

    function playNext() {
      if (index >= timeline.length) {
        setPlayingSituationId(null)
        return
      }

      const audio = new Audio(timeline[index])
      audioRef.current = audio

      audio.onended = () => {
        index++
        playNext()
      }

      audio.play().catch(() => {})
    }

    playNext()
  }

  /* --------------------------------
     Delete Situation
  --------------------------------- */
  async function deleteSituation(id) {
    if (!confirm('Delete all recordings for this situation?')) return

    await fetch('/api/talkrehearsel/recordings', {
      method: 'DELETE',
      body: JSON.stringify({ situationId: id }),
    })

    // refresh current page safely
    setSituations(prev => prev.filter(s => s.situation.id !== id))
  }

  /* --------------------------------
     UI
  --------------------------------- */
/*  if (loading) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" />
      </main>
    )
  }*/

return (
  <main className="flex-1 bg-white p-8 overflow-y-auto space-y-10">
    
    {/* ================= Header & Search ================= */}
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <div className="w-2 h-6 bg-indigo-600 rounded-full" />
          Recording Vault
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Review and replay your captured conversation practice.
        </p>
      </div>

      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search situations..."
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>
    </section>

    {/* ================= Empty State ================= */}
    {situations.length === 0 && (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <MicOff size={32} />
        </div>
        <div>
          <p className="text-slate-900 font-bold">No recordings found.</p>
          <p className="text-slate-500 text-sm">Start a rehearsal session to see your history here.</p>
        </div>
      </div>
    )}

    {/* ================= Situations Grid ================= */}
    <section className="grid grid-cols-1 gap-6">
      {situations.map(group => (
        <div
          key={group.situation.id}
          className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
        >
          {/* Accent Border on Hover */}
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest rounded">Saved Rehearsal</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.lines.length} Total Lines</p>
                </div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  {group.situation.title}
                </h2>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => playConversation(group)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md ${
                    playingSituationId === group.situation.id 
                    ? 'bg-slate-900 text-white shadow-slate-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {playingSituationId === group.situation.id ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  {playingSituationId === group.situation.id ? 'Stop' : 'Play Full'}
                </button>

                <button
                  onClick={() => deleteSituation(group.situation.id)}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Expanded Content: Lines Preview */}
            <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.lines.map(({ line }) => (
                <div
                  key={line.id}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-teal-200 transition-all cursor-default"
                >
                  <div className="mt-1 p-1.5 bg-white rounded-lg text-teal-600 shadow-sm">
                    <Headphones size={14} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-teal-600 tracking-tighter">{line.actor.name}</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic line-clamp-2">
                      "{line.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>

    {/* ================= Pagination ================= */}
    {totalPages > 1 && (
      <div className="flex items-center justify-center gap-6 pt-10 border-t border-slate-50">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Page</span>
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">{page}</span>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">of {totalPages}</span>
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    )}

  </main>
)
}
