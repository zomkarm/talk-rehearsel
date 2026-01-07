'use client'

import { useEffect, useRef, useState } from 'react'
import { Headphones, Play, Loader2 } from 'lucide-react'

export default function RecordingsPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingSituationId, setPlayingSituationId] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  const audioRef = useRef(null)

  useEffect(() => {
    async function fetchRecordings() {
      try {
        const res = await fetch(
                      `/api/talkrehearsel/recordings?search=${search}&page=${page}`
                    )
        const data = await res.json()

        /**
         * Group recordings by situation
         */
        const map = {}

        data.recordings.forEach(r => {
          const s = r.line.situation
          if (!map[s.id]) {
            map[s.id] = {
              situation: s,
              lines: []
            }
          }

          map[s.id].lines.push({
            line: r.line,
            recording: r
          })
        })

        setGroups(Object.values(map))
      } catch (err) {
        console.error('Failed to load recordings', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecordings()
  }, [])

  /* --------------------------------
     Playback Logic
  --------------------------------- */
  async function playConversation(group) {
    if (playingSituationId === group.situation.id) {
      audioRef.current?.pause()
      setPlayingSituationId(null)
      return
    }

    setPlayingSituationId(group.situation.id)

    const res = await fetch(
      `/api/talkrehearsel/conversations/${group.situation.id}`
    )
    const data = await res.json()

    const timeline = data.conversation
      .filter(turn => turn.audio?.src)
      .map(turn => turn.audio.src)

    let index = 0

    function playNext() {
      if (index >= timeline.length) {
        setPlayingSituationId(null)
        return
      }

      const audio = new Audio(timeline[index])
      audioRef.current = audio

      audio.onended = () => {
        index++
        playNext()
      }

      audio.play().catch(() => {})
    }

    playNext()
  }


  /* --------------------------------
     UI
  --------------------------------- */
  if (loading) {
    return (
      <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" />
      </main>
    )
  }

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto space-y-8">
      
      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800">
          Your Recordings
        </h1>
        <p className="text-gray-500 mt-1">
          Replay full conversations with your voice
        </p>
      </section>

      {groups.length === 0 && (
        <p className="text-gray-500">
          You haven’t recorded any conversations yet.
        </p>
      )}

      {/* Situations */}
      <section className="space-y-4">
        {groups.map(group => (
          <div
            key={group.situation.id}
            className="border rounded-xl p-5 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {group.situation.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {group.lines.length} recorded lines
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => playConversation(group)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  <Play size={16} />
                  {playingSituationId === group.situation.id
                    ? 'Stop'
                    : 'Play'}
                </button>
                <button
                  onClick={async () => {
                    await fetch('/api/talkrehearsel/recordings', {
                      method: 'DELETE',
                      body: JSON.stringify({ situationId: group.situation.id }),
                    })
                    location.reload()
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>

            </div>

            {/* Timeline Preview */}
            <div className="mt-4 space-y-2">
              {group.lines
                .sort((a, b) => a.line.order - b.line.order)
                .map(({ line }) => (
                  <div
                    key={line.id}
                    className="text-sm text-gray-600 flex gap-2"
                  >
                    <Headphones size={14} />
                    <span>
                      {line.actor.name}: {line.text}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>

    </main>
  )
}
