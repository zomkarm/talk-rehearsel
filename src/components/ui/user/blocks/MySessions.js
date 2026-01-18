'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">
            My Hosted Sessions
          </h1>
          <Link href="/practice-sessions" className="border px-4 py-2 rounded-lg text-sm">
            Back
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-600">
            You haven’t hosted any sessions yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {sessions.map(s => (
              <div
                key={s.id}
                className="border rounded-xl p-5 bg-white"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">{s.title}</h3>
                  {isSessionOver(s) && (
                    <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded mt-2">
                      Completed
                    </span>
                  )}

                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(s.scheduled_at).toLocaleString()}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  {s.requestsCount} join requests
                </p>

                <div className="flex gap-3 mt-4">
                  {!isSessionOver(s) ? (
                    <a
                      href={s.room_link}
                      target="_blank"
                      className="text-sm px-3 py-1 border rounded-lg"
                    >
                      Open Room
                    </a>
                  ) : (
                    <span className="text-sm px-3 py-1 border rounded-lg text-gray-400 cursor-not-allowed">
                      Session ended
                    </span>
                  )}


                  <button
                    onClick={() => setEditingSession(s)}
                    disabled={isSessionOver(s)}
                    className={`text-sm px-3 py-1 border rounded-lg ${
                      isSessionOver(s)
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => cancelSession(s.id)}
                    className="text-sm px-3 py-1 border rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-6">
        <header>
          <h2 className="text-xl font-semibold">Edit Session</h2>
          <p className="text-sm text-gray-500">
            Update session details
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
                rows={3}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </section>

          {/* Time */}
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
              className="w-full border rounded-lg px-4 py-2"
            />
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
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white"
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
