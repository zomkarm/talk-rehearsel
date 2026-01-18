'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

      router.push('/practice-sessions/my')
    } catch {
      alert('Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">

        <header>
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">
              Create Practice Session
            </h1>
            <Link href="/practice-sessions" className="border px-4 py-2 rounded-lg text-sm">
              Back
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Schedule a real-time speaking session with other learners
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Session title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                required
                placeholder="e.g. Casual English Conversation"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={4}
                placeholder="What will participants practice?"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </section>

          {/* Time & Duration */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date & time
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={form.scheduled_at}
                onChange={updateField}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration_minutes"
                min={15}
                step={15}
                value={form.duration_minutes}
                onChange={updateField}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </section>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Timezone
            </label>

            <input
              name="timezone"
              value={form.timezone}
              onChange={updateField}
              placeholder="e.g. Asia/Kolkata"
              className="w-full border rounded-lg px-4 py-2"
            />

            <p className="text-xs text-gray-500 mt-1">
              Auto-detected from your device. Change if this session should follow a different timezone.
            </p>
          </div>


          {/* Mode & Capacity */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Session mode
              </label>
              <select
                name="mode"
                value={form.mode}
                onChange={updateField}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Max participants
              </label>
              <input
                type="number"
                name="max_participants"
                min={2}
                value={form.max_participants}
                onChange={updateField}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </section>

          {/* Room */}
          <div>
            <label className="block text-sm font-medium mb-1">
              External meeting link
            </label>
            <input
              name="room_link"
              value={form.room_link}
              onChange={updateField}
              required
              placeholder="Zoom / Google Meet link"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? 'Creating…' : 'Create Session'}
            </button>
            <button
              onClick={()=>{
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
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >Clear
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
