'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'

export default function CreateSession() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    timezone: '',
    duration_minutes: 30,
    mode: 'audio',
    max_participants: 5,
    room_link: '',
  })

  const [loading, setLoading] = useState(false)

  const detect_timezone = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setForm(f => ({ ...f, timezone: tz }))
  }
  // Auto-detect timezone
  useEffect(() => {
    detect_timezone()
  }, [])

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/practice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()

      router.push('/user/practice-sessions/my')
    } catch {
      alert('Failed to create session')
    } finally {
      setLoading(false)
    }
  }

return (
  <main className="flex-1 bg-white p-8 overflow-y-auto">
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* ================= Header ================= */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-teal-400 to-indigo-600 rounded-full" />
            Create Practice Session
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Schedule a real-time speaking session with other learners.
          </p>
        </div>

        <Link 
          href="/user/practice-sessions" 
          className="w-fit px-6 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </header>

      {/* ================= Form Stage ================= */}
      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Section: Identity */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Basic Info</span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Session Title</label>
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
                placeholder="e.g. Casual English Conversation"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={4}
                placeholder="What will participants practice?"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm resize-none"
              />
            </div>
          </div>
        </section>

        {/* Section: Logistics */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded">Schedule & Settings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Date & Time</label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={form.scheduled_at}
                onChange={updateField}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Duration (Minutes)</label>
              <input
                type="number"
                name="duration_minutes"
                min={15}
                step={15}
                value={form.duration_minutes}
                onChange={updateField}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Session Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={updateField}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="audio">Audio Only</option>
                <option value="video">Video Session</option>
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
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Timezone</label>
            <input
              name="timezone"
              value={form.timezone}
              onChange={updateField}
              placeholder="e.g. Asia/Kolkata"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm"
            />
            <p className="text-[10px] text-slate-400 mt-2 italic px-1">
              Auto-detected. Change only if this session follows a specific regional time.
            </p>
          </div>
        </section>

        {/* Section: Link */}
        <section className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Meeting Link</label>
            <input
              name="room_link"
              value={form.room_link}
              onChange={updateField}
              required
              placeholder="Zoom / Google Meet link"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all shadow-sm"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-center gap-4 pt-8 border-t border-slate-50">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gradient-to-br hover:from-teal-500 hover:to-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 min-w-[200px]"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setForm({
                title: '',
                description: '',
                scheduled_at: '',
                timezone: '',
                duration_minutes: 30,
                mode: 'audio',
                max_participants: 5,
                room_link: '',
              })
              detect_timezone()
            }}
            className="px-10 py-4 border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 hover:text-slate-600 transition-all min-w-[150px]"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  </main>
)
}
