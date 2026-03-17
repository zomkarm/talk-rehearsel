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
  <main className="flex-1 bg-white p-8 overflow-y-auto">
    <div className="max-w-7xl mx-auto space-y-10 mb-20">
      
      {/* ================= Header Section ================= */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
            Live Practice Sessions
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Join real-time speaking rooms with other practitioners worldwide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/user/practice-sessions/my" className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            My Sessions
          </Link>
          <Link href="/user/practice-sessions/requests" className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            Requests
          </Link>
          <Link href="/user/practice-sessions/join" className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            Join Room
          </Link>
          <Link href="/user/practice-sessions/create" className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
            + Create
          </Link>
        </div>
      </section>

      {/* ================= World Map Visualization ================= */}
      {!loading && sessions.length > 0 && (
        <section className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
           <WorldSessionsMap sessions={sessions} />
        </section>
      )}

      {/* ================= Content Stage ================= */}
      <section className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
               <Calendar size={32} />
             </div>
             <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No upcoming sessions available.</p>
             <p className="text-slate-400 text-xs mt-1">Check back later or create your own room to start practicing.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedSessions).map(([day, daySessions]) => (
              <section key={day} className="relative">
                
                {/* Sticky Day Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 py-4 mb-8 border-b border-slate-50">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="w-8 h-px bg-slate-200" />
                    {day}
                  </h2>
                </div>

                {/* Timeline Layout */}
                <div className="space-y-8 pl-0 md:pl-10 relative">
                  {/* Vertical Timeline Line (Desktop Only) */}
                  <div className="hidden md:block absolute left-[115px] top-0 bottom-0 w-px bg-slate-100" />

                  {daySessions.map(s => {
                    const date = new Date(s.scheduled_at)
                    return (
                      <div key={s.id} className="flex flex-col md:flex-row gap-6 items-start group">
                        
                        {/* Time Column */}
                        <div className="w-32 md:text-right shrink-0 pt-2 space-y-1 z-10">
                          <p className="text-lg font-black text-slate-900 tracking-tighter leading-none">
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 inline-block px-2 py-0.5 rounded">
                            {s.duration_minutes} MINS
                          </p>
                        </div>

                        {/* Session Card */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-teal-500 transition-colors" />
                          
                          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                                  {s.mode}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {s.timezone}
                                </span>
                              </div>
                              
                              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                {s.title}
                              </h3>

                              {s.description && (
                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl italic">
                                  "{s.description}"
                                </p>
                              )}
                            </div>

                            {/* Actions Area */}
                            <div className="shrink-0 w-full lg:w-auto pt-2">
                              {s.isHost ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-700">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Hosting Session</span>
                                </div>
                              ) : s.hasRequested ? (
                                <button
                                  disabled
                                  className="w-full lg:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest cursor-not-allowed bg-slate-50"
                                >
                                  Request {s.requestStatus}
                                </button>
                              ) : (
                                <button
                                  onClick={() => requestToJoin(s.id)}
                                  className="w-full lg:w-auto px-8 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100"
                                >
                                  Request to Join
                                </button>
                              )}
                            </div>
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
      </section>
    </div>
  </main>
)
}
