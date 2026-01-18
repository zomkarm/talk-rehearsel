'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import {
  GeoComponent,
  TooltipComponent,
} from 'echarts/components'
import { ScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

// Register ECharts modules (tree-shaking safe)
echarts.use([
  GeoComponent,
  TooltipComponent,
  ScatterChart,
  CanvasRenderer,
])

// Approx visual centroids (UX only)
const TIMEZONE_COORDS = {
  America: [-100, 40],
  Europe: [10, 50],
  Africa: [20, 5],
  Asia: [90, 35],
  Australia: [135, -25],
}

function getCoord(tz) {
  if (!tz) return null
  return TIMEZONE_COORDS[tz.split('/')[0]] || null
}

function WorldSessionsMap({ sessions }) {
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadMap() {
      if (echarts.getMap('world')) {
        setMapReady(true)
        return
      }

      const res = await fetch('/maps/world.json')
      const worldJson = await res.json()

      echarts.registerMap('world', worldJson)
      if (mounted) setMapReady(true)
    }

    loadMap()
    return () => (mounted = false)
  }, [])

  const points = useMemo(() => {
    if (!sessions?.length) return []

    const grouped = {}

    sessions.forEach(s => {
      const coord = getCoord(s.timezone)
      if (!coord) return

      const key = coord.join(',')
      grouped[key] ||= { value: [...coord, 0] }
      grouped[key].value[2] += 1
    })

    return Object.values(grouped)
  }, [sessions])

  if (!mapReady || !points.length) return null

  const option = {
    backgroundColor: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: '#f8fafc' }, // ocean top
        { offset: 1, color: '#eef2ff' }, // ocean bottom
      ],
    },


    tooltip: {
      backgroundColor: '#111827',
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: p => `${p.value[2]} active session(s)`,
    },

    geo: {
      map: 'world',
      roam: false,
      zoom: 1.15,
      center: [10, 20],
      silent: true,

      itemStyle: {
        areaColor: '#e5e7eb',     // 👈 darker land
        borderColor: '#9ca3af',   // 👈 visible borders
        borderWidth: 0.8,
      },

      emphasis: {
        itemStyle: {
          areaColor: '#c7d2fe',   // 👈 hover highlight
        },
      },
    },


    series: [
      // 🔵 Base dots
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: points,
        symbolSize: v => Math.min(10 + v[2] * 2.5, 26),
        itemStyle: {
          color: '#4f46e5',
          shadowBlur: 10,
          shadowColor: 'rgba(79,70,229,0.4)',
          opacity: 0.9,
        },
        zlevel: 3,
      },

      // ✨ Ripple pulse
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: points.filter(p => p.value[2] > 1),
        symbolSize: v => Math.min(14 + v[2] * 3, 30),
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
        },
        itemStyle: {
          color: '#6366f1',
        },
        silent: true,
        zlevel: 2,
      },
    ],

    animationDuration: 1200,
    animationEasing: 'cubicOut',
  }

  return (
    <section className="border rounded-2xl p-5 bg-white shadow-sm">
      <header className="mb-3">
        <h2 className="text-sm font-semibold">
          Sessions around the world
        </h2>
        <p className="text-xs text-gray-500">
          Live distribution by timezone
        </p>
      </header>

      <div className="h-80 rounded-xl overflow-hidden">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          notMerge
          lazyUpdate
        />
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Global activity snapshot • Read-only visualization
      </p>
    </section>
  )
}


function groupByDay(sessions) {
  return sessions.reduce((acc, s) => {
    const dayKey = new Date(s.scheduled_at).toDateString()
    acc[dayKey] ||= []
    acc[dayKey].push(s)
    return acc
  }, {})
}

export default function PracticeSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/practice-sessions')
      const data = await res.json()
      setSessions(data)
      setLoading(false)
    }
    load()
  }, [])

  async function requestToJoin(scheduleId) {
    await fetch('/api/practice-sessions/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule_id: scheduleId })
    })
    alert('Request sent')
    location.reload()
  }

  const groupedSessions = useMemo(
    () => groupByDay(sessions),
    [sessions]
  )

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">
              Practice Sessions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Discover and join real-time speaking sessions
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/practice-sessions/my"
              className="border px-4 py-2 rounded-lg text-sm"
            >
              My Sessions
            </Link>
            <Link
              href="/practice-sessions/requests"
              className="border px-4 py-2 rounded-lg text-sm"
            >
              Requests
            </Link>
            <Link
              href="/practice-sessions/join"
              className="border px-4 py-2 rounded-lg text-sm"
            >
              Join Room
            </Link>
            <Link
              href="/practice-sessions/create"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              + Create
            </Link>
          </div>
        </div>

        {/* 🌍 World Sessions Map (visual only) */}
          {!loading && sessions.length > 0 && (
            <WorldSessionsMap sessions={sessions} />
          )}

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-gray-50">
            No upcoming sessions available.
          </div>
        ) : (
          <div className="space-y-10">

            {Object.entries(groupedSessions).map(([day, daySessions]) => (
              <section key={day} className="space-y-4">

                {/* Day Header */}
                <div className="sticky top-0 bg-white z-10">
                  <h2 className="text-lg font-semibold">
                    {day}
                  </h2>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {daySessions.map(s => {
                    const date = new Date(s.scheduled_at)

                    return (
                      <div
                        key={s.id}
                        className="flex gap-4 items-start"
                      >
                        {/* Time rail */}
                        <div className="w-24 text-right shrink-0 pt-1">
                          <p className="text-sm font-medium">
                            {date.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-gray-400">
                            {s.duration_minutes} min
                          </p>
                        </div>

                        {/* Card */}
                        <div className="flex-1 border rounded-xl p-4 hover:shadow-sm transition bg-white">

                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {s.title}
                              </h3>

                              {s.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {s.description}
                                </p>
                              )}
                            </div>

                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">
                              {s.mode}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Timezone: {s.timezone}
                          </p>

                          {/* Actions */}
                          <div className="mt-4">
                            {s.isHost ? (
                              <span className="text-xs text-indigo-600 font-medium">
                                You’re hosting this session
                              </span>
                            ) : s.hasRequested ? (
                              <button
                                disabled
                                className="text-xs px-3 py-1 border rounded-lg text-gray-400 cursor-not-allowed"
                              >
                                Request {s.requestStatus}
                              </button>
                            ) : (
                              <button
                                onClick={() => requestToJoin(s.id)}
                                className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50"
                              >
                                Request to Join
                              </button>
                            )}
                          </div>

                        </div>
                      </div>
                    )
                  })}
                </div>

              </section>
            ))}

          </div>
        )}

      </div>
    </main>
  )
}
