'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react'

function isSessionOver(session) {
  const start = new Date(session.scheduled_at)
  const end = new Date(start.getTime() + session.duration_minutes * 60000)
  return end < new Date()
}

export default function MySessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSession, setEditingSession] = useState(null)
  const [saving, setSaving] = useState(false)


  useEffect(() => {
    fetch('/api/practice-sessions/my')
      .then(res => res.json())
      .then(setSessions)
      .finally(() => setLoading(false))
  }, [])

  async function cancelSession(id) {
    const confirmed = confirm('Are you sure you want to cancel this session?')
    if (!confirmed) return

    try {
      const res = await fetch(`/api/practice-sessions/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to cancel session')
        return
      }

      // Remove cancelled session from UI
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }
  }


return (
  <main className="flex-1 bg-white p-8 overflow-y-auto">
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* ================= Header ================= */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
            My Hosted Sessions
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your scheduled practice rooms and participant requests.
          </p>
        </div>

        <Link 
          href="/user/practice-sessions" 
          className="w-fit px-6 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </section>

      {/* ================= Content Stage ================= */}
      <section className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
            Loading your schedule...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
              <Calendar size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">You haven’t hosted any sessions yet.</p>
            <Link href="/user/practice-sessions/create" className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">
              Create your first room →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map(s => (
              <div
                key={s.id}
                className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden"
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isSessionOver(s) ? 'bg-slate-200' : 'bg-indigo-600'}`} />
                
                <div className="flex flex-col h-full space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Host Dashboard</span>
                        {isSessionOver(s) && (
                          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                        {s.title}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled For</p>
                      <p className="text-xs font-bold text-slate-700">
                        {new Date(s.scheduled_at).toLocaleDateString()} at {new Date(s.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement</p>
                      <p className="text-xs font-bold text-indigo-600">
                        {s.requestsCount} Join Requests
                      </p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
                    {!isSessionOver(s) ? (
                      <a
                        href={s.room_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gradient-to-br hover:from-teal-500 hover:to-indigo-600 transition-all shadow-lg shadow-slate-100"
                      >
                        <ExternalLink size={14} /> Open Room
                      </a>
                    ) : (
                      <span className="flex-1 min-w-[120px] flex items-center justify-center px-4 py-2.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 cursor-not-allowed">
                        Session Ended
                      </span>
                    )}

                    <button
                      onClick={() => setEditingSession(s)}
                      disabled={isSessionOver(s)}
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => cancelSession(s.id)}
                      className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-auto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      
    </div>
    {/* ================= Modals ================= */}
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onUpdated={(updated) => {
            setSessions(prev =>
              prev.map(s => (s.id === updated.id ? updated : s))
            )
            setEditingSession(null)
          }}
        />
      )}
  </main>
)
}


function EditSessionModal({ session, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: session.title,
    description: session.description || '',
    scheduled_at: session.scheduled_at.slice(0, 16),
    timezone: session.timezone || '',
    duration_minutes: session.duration_minutes,
    mode: session.mode,
    max_participants: session.max_participants,
    room_link: session.room_link,
  })

  const [loading, setLoading] = useState(false)

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/practice-sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()

      const updated = await res.json()
      onUpdated(updated)
    } catch {
      alert('Failed to update session')
    } finally {
      setLoading(false)
    }
  }

  if (isSessionOver(session)) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl">
          <p className="text-gray-600">
            This session has already ended and cannot be edited.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 border rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    )
  }


return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Added max-h and overflow-y-auto to the container to prevent top-merging */}
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden relative max-h-[95vh] flex flex-col">
        
        {/* Visual Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-indigo-600 z-10" />
        
        {/* Fixed Header */}
        <header className="p-8 pb-4 shrink-0 bg-white">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Session</h2>
          <p className="text-slate-500 text-sm font-medium">
            Update your rehearsal details and participant settings.
          </p>
        </header>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* Section: Context */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Session Identity</span>
            </div>
            
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"
              />
            </div>
          </section>

          {/* Section: Timing & Logistics */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Schedule & Capacity</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Date & Time</label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={form.scheduled_at}
                onChange={updateField}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Duration (Min)</label>
              <input
                type="number"
                name="duration_minutes"
                min={15}
                step={15}
                value={form.duration_minutes}
                onChange={updateField}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={updateField}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Max Participants</label>
              <input
                type="number"
                name="max_participants"
                min={2}
                value={form.max_participants}
                onChange={updateField}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
          </section>

          {/* Section: Connection */}
          <section className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Meeting Link</label>
              <input
                name="room_link"
                value={form.room_link}
                onChange={updateField}
                placeholder="https://zoom.us/..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
          </section>

          {/* Footer Actions */}
          <footer className="flex justify-end items-center gap-4 pt-6 border-t border-slate-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="px-10 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
