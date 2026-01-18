'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const PAGE_SIZE = 10

export default function ManagePracticeSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState({
    status: '',
    date: '',
  })

  useEffect(() => {
    loadSessions()
  }, [page, filters])

  async function loadSessions() {
    setLoading(true)

    try {
      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
        ...(filters.status && { status: filters.status }),
        ...(filters.date && { date: filters.date }),
      })

      const res = await fetch(`/api/admin/practice-sessions?${params}`)
      if (!res.ok) throw new Error()

      const data = await res.json()
      setSessions(data.items)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  async function forceCancel(id) {
    const reason =
      prompt('Reason for cancelling this session (optional):') || null

    const confirmed = confirm(
      'Force cancel this session? This action cannot be undone.'
    )
    if (!confirmed) return

    try {
      const res = await fetch(
        `/api/admin/practice-sessions/${id}/cancel`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason }),
        }
      )

      if (!res.ok) throw new Error()

      toast.success('Session cancelled')
      loadSessions()
    } catch {
      toast.error('Failed to cancel session')
    }
  }


  return (
    <main className="flex-1 bg-white p-6 mt-2 rounded-tl-3xl overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Manage Practice Sessions
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filters.status}
          onChange={e =>
            setFilters(f => ({ ...f, status: e.target.value }))
          }
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="full">Full</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          className="border rounded-lg px-3 py-2 text-sm"
          value={filters.date}
          onChange={e =>
            setFilters(f => ({ ...f, date: e.target.value }))
          }
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Host</th>
                <th className="p-3">Scheduled</th>
                <th className="p-3">Timezone</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map(s => (
                <tr
                  key={s.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {s.title}
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {s.host_user_id.slice(0, 8)}…
                  </td>
                  <td className="p-3">
                    {new Date(s.scheduled_at).toLocaleString()}
                  </td>
                  <td className="p-3">{s.timezone}</td>
                  <td className="p-3 capitalize">{s.mode}</td>
                  <td className="p-3 capitalize">
                    {s.status}

                    {s.status === 'cancelled' && s.admin_cancel_reason && (
                      <p className="text-xs text-gray-400 mt-1">
                        Reason: {s.admin_cancel_reason}
                      </p>
                    )}
                  </td>


                  <td className="p-3 text-right">
                    {s.status !== 'cancelled' && (
                      <button
                        onClick={() => forceCancel(s.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                        Force cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
          className="border px-3 py-1 rounded-lg text-sm disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm px-2 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="border px-3 py-1 rounded-lg text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  )
}
