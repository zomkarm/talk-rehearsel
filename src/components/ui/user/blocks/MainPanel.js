'use client'

import { useEffect, useState } from 'react'
import {
  Mic,
  Headphones,
  Theater,
  Clock,
  CheckCircle2
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
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto space-y-8">

      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Your practice overview and progress at a glance
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-xl border bg-indigo-50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Theater className="text-indigo-600" />
            <h3 className="font-semibold text-indigo-900">
              Situations Practiced
            </h3>
          </div>
          <p className="text-3xl font-bold text-indigo-800">
            {loading ? '—' : stats.situations}
          </p>
          <p className="text-sm text-indigo-700">
            Unique situations practiced
          </p>
        </div>

        <div className="rounded-xl border bg-emerald-50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Mic className="text-emerald-600" />
            <h3 className="font-semibold text-emerald-900">
              Lines Recorded
            </h3>
          </div>
          <p className="text-3xl font-bold text-emerald-800">
            {loading ? '—' : stats.recordings}
          </p>
          <p className="text-sm text-emerald-700">
            Total voice recordings
          </p>
        </div>

        <div className="rounded-xl border bg-amber-50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Theater className="text-amber-600" />
            <h3 className="font-semibold text-amber-900">
              Conversations Completed
            </h3>
          </div>
          <p className="text-3xl font-bold text-amber-800">
            {loading ? '—' : stats.situations}
          </p>
          <p className="text-sm text-amber-700">
            Unique situations practiced
          </p>
        </div>

        {/*<div className="rounded-xl border bg-amber-50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-amber-600" />
            <h3 className="font-semibold text-amber-900">
              Practice Time
            </h3>
          </div>
          <p className="text-3xl font-bold text-amber-800">
            {loading ? '—' : `${stats.practiceMinutes} min`}
          </p>
          <p className="text-sm text-amber-700">
            Total rehearsal duration
          </p>
        </div>*/}

      </section>

      {/* Recent Activity (placeholder) */}
      <section className="rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
        </div>

        {stats.recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recent activity yet.
          </p>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((item, i) => (
              <div
                key={i}
                className="text-sm text-gray-700 flex flex-col"
              >
                <span className="font-medium">
                  <span className="font-bold">Situation : </span> {item.situationTitle}
                </span>
                <span className="text-gray-500">
                  {item.actorName}: “{item.lineText}”
                </span>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Tips */}
      <section className="rounded-xl bg-gray-50 border p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-indigo-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Getting Started
            </h3>
            <p className="text-sm text-gray-600">
              Pick a situation from the sidebar, choose your role, and start practicing.
              Your recordings will appear automatically once saved.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
