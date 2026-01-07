'use client'

import { useEffect, useRef, useState } from 'react'
import { Headphones, Play, Loader2, Trash2 } from 'lucide-react'

export default function RecordingsPage() {
  const [situations, setSituations] = useState([])
  const [loading, setLoading] = useState(true)
  const [playingSituationId, setPlayingSituationId] = useState(null)

  // separate states (this fixes search)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const audioRef = useRef(null)

  /* --------------------------------
     Debounce search (CORRECT)
  --------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput)
      setPage(1)
    }, 400)

    return () => clearTimeout(t)
  }, [searchInput])

  /* --------------------------------
     Fetch situations
  --------------------------------- */
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/talkrehearsel/recordings?search=${searchQuery}&page=${page}`
        )
        const data = await res.json()

        setSituations(data.situations || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        console.error('Failed to load recordings', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, page])

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
     Delete Situation
  --------------------------------- */
  async function deleteSituation(id) {
    if (!confirm('Delete all recordings for this situation?')) return

    await fetch('/api/talkrehearsel/recordings', {
      method: 'DELETE',
      body: JSON.stringify({ situationId: id }),
    })

    // refresh current page safely
    setSituations(prev => prev.filter(s => s.situation.id !== id))
  }

  /* --------------------------------
     UI
  --------------------------------- */
  if (loading) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" />
      </main>
    )
  }

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto space-y-8">

      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Your Recordings
        </h1>
        <p className="text-gray-500">
          Replay full conversations with your voice
        </p>

        {/* Search */}
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search by situation title..."
          className="w-full max-w-md px-4 py-2 border rounded-lg text-sm"
        />
      </section>

      {situations.length === 0 && (
        <p className="text-gray-500">
          You haven’t recorded any conversations yet.
        </p>
      )}

      {/* Situations */}
      <section className="space-y-4">
        {situations.map(group => (
          <div
            key={group.situation.id}
            className="border rounded-xl p-5 bg-gray-50"
          >
            <div className="flex justify-between items-center">
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
                  {playingSituationId === group.situation.id ? 'Stop' : 'Play'}
                </button>

                <button
                  onClick={() => deleteSituation(group.situation.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {group.lines.map(({ line }) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

    </main>
  )
}
