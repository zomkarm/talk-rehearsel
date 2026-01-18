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
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Join Room</h1>
            <p className="text-sm text-gray-500">
              Join your active or upcoming practice sessions
            </p>
          </div>

          <Link
            href="/practice-sessions"
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Back
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-gray-50">
            No active sessions to join right now.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(s => {
              const start = new Date(s.scheduled_at)
              const now = new Date()
              const minsLeft = Math.max(
                0,
                Math.floor((start - now) / 60000)
              )

              return (
                <div
                  key={s.id}
                  className="border rounded-xl p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-gray-600">
                      {start.toLocaleString()} · {s.duration_minutes} min · {s.mode}
                    </p>

                    {!s.canJoin && !s.hasEnded && (
                      <p className="text-xs text-gray-500 mt-1">
                        Starts in {minsLeft} min
                      </p>
                    )}

                    {s.hasEnded && (
                      <p className="text-xs text-gray-400 mt-1">
                        Session ended
                      </p>
                    )}
                  </div>

                  <div>
                    {s.canJoin ? (
                      <a
                        href={s.room_link}
                        target="_blank"
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm"
                      >
                        {s.isHost ? 'Open Room' : 'Join Room'}
                      </a>
                    ) : (
                      <button
                        disabled
                        className="px-5 py-2 rounded-lg text-sm border text-gray-400 cursor-not-allowed"
                      >
                        {s.hasEnded ? 'Ended' : 'Not started'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
