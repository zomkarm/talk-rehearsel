'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SessionRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true)
        const res = await fetch('/api/practice-sessions/request')

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to load requests')
        }

        const data = await res.json()
        setRequests(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [])

  async function updateStatus(id, status) {
    const confirmed = confirm(
      `Are you sure you want to ${status} this request?`
    )
    if (!confirmed) return

    setActionLoading(id)
    setError(null)

    // optimistic remove
    const previous = requests
    setRequests(prev => prev.filter(r => r.id !== id))

    try {
      const res = await fetch(`/api/practice-sessions/request/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Action failed')
      }

      alert(`Request ${status}`)
    } catch (err) {
      console.error(err)
      alert(err.message)
      setRequests(previous) // rollback
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Join Requests
          </h1>

          <Link
            href="/practice-sessions"
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Back
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : requests.length === 0 ? (
          <div className="text-gray-600 border rounded-xl p-6 text-center">
            No pending requests.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(r => (
              <div
                key={r.id}
                className="border rounded-xl p-4 flex justify-between items-center bg-white"
              >
                <div>
                  <p className="font-medium">
                    {r.user.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    wants to join <span className="font-medium">{r.schedule.title}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={actionLoading === r.id}
                    onClick={() => updateStatus(r.id, 'approved')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    disabled={actionLoading === r.id}
                    onClick={() => updateStatus(r.id, 'rejected')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
