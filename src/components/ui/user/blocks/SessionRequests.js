'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'

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
    <main className="flex-1 bg-white p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ================= Header ================= */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-teal-400 to-indigo-600 rounded-full" />
              Join Requests
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Review and manage participants wanting to join your sessions.
            </p>
          </div>

          <Link 
            href="/user/practice-sessions" 
            className="w-fit px-6 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back
          </Link>
        </section>

        {/* ================= Feedback/Errors ================= */}
        {error && (
          <div className="border-l-4 border-red-500 bg-red-50/50 text-red-700 px-6 py-4 rounded-xl text-sm font-semibold flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        {/* ================= Content Stage ================= */}
        <section>
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
              Fetching requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] space-y-3">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No pending requests at the moment.</p>
              <p className="text-slate-300 text-xs">When users want to join your sessions, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(r => (
                <div
                  key={r.id}
                  className="group border border-slate-100 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm font-black text-lg">
                      {r.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 tracking-tight">
                        {r.user.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        wants to join <span className="text-indigo-600 font-bold">"{r.schedule.title}"</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      disabled={actionLoading === r.id}
                      onClick={() => updateStatus(r.id, 'approved')}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gradient-to-br hover:from-teal-500 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-slate-100 active:scale-95"
                    >
                      {actionLoading === r.id ? '...' : 'Approve'}
                    </button>

                    <button
                      disabled={actionLoading === r.id}
                      onClick={() => updateStatus(r.id, 'rejected')}
                      className="flex-1 md:flex-none px-6 py-2.5 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-50 active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
