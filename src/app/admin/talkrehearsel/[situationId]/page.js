'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

export default function ManageSituation() {
  const { situationId } = useParams()

  const [situation, setSituation] = useState(null)
  const [loading, setLoading] = useState(true)

  const [actorName, setActorName] = useState('')
  const [lineText, setLineText] = useState('')
  const [lineActor, setLineActor] = useState('')
  const [lineOrder, setLineOrder] = useState('')
  const [voiceAccent, setVoiceAccent] = useState('')
  const [activeLineId, setActiveLineId] = useState(null)


  /* ----------------------------
     Fetch Situation
  -----------------------------*/
  const fetchSituation = async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/admin/talkrehearsel/situations/${situationId}`
      )
      const data = await res.json()
      setSituation(data.situation)
    } catch {
      toast.error('Failed to load situation')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSituation()
  }, [])

  /* ----------------------------
     Actors
  -----------------------------*/
  const addActor = async () => {
    if (!actorName.trim()) return

    await fetch('/api/admin/talkrehearsel/actors', {
      method: 'POST',
      body: JSON.stringify({
        situation_id: situationId,
        name: actorName
      })
    })

    setActorName('')
    fetchSituation()
    toast.success('Actor added')
  }

  const deleteActor = async (id) => {
    await fetch(`/api/admin/talkrehearsel/actors?id=${id}`, {
      method: 'DELETE'
    })

    fetchSituation()
    toast.success('Actor deleted')
  }

  /* ----------------------------
     Lines
  -----------------------------*/
  const addLine = async () => {
    if (!lineText || !lineActor || lineOrder === '') return

    await fetch('/api/admin/talkrehearsel/lines', {
      method: 'POST',
      body: JSON.stringify({
        situation_id: situationId,
        actor_id: lineActor,
        text: lineText,
        order: Number(lineOrder)
      })
    })

    setLineText('')
    setLineActor('')
    setLineOrder('')
    fetchSituation()
    toast.success('Line added')
  }

  const deleteLine = async (id) => {
    await fetch(`/api/admin/talkrehearsel/lines?id=${id}`, {
      method: 'DELETE'
    })

    fetchSituation()
    toast.success('Line deleted')
  }

  /* ----------------------------
   Line Voices
  -----------------------------*/
  const addVoice = async (lineId) => {
    if (!voiceAccent || !voiceSrc) return

    await fetch('/api/admin/talkrehearsel/voices', {
      method: 'POST',
      body: JSON.stringify({
        line_id: lineId,
        accent: voiceAccent,
        audio_src: voiceSrc
      })
    })

    setVoiceAccent('')
    setVoiceSrc('')
    setActiveLineId(null)

    fetchSituation()
    toast.success('Voice added')
  }

  const deleteVoice = async (id) => {
    await fetch(`/api/admin/talkrehearsel/voices?id=${id}`, {
      method: 'DELETE'
    })

    fetchSituation()
    toast.success('Voice deleted')
  }


  if (loading) {
    return <p className="p-6 text-gray-500">Loading...</p>
  }

  if (!situation) {
    return <p className="p-6 text-red-500">Situation not found</p>
  }

  return (
    <main className="flex-1 bg-white p-6 rounded-tl-3xl overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{situation.title}</h1>
        <p className="text-gray-600">{situation.description}</p>
      </div>

      {/* ACTORS */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Actors</h2>

        <div className="space-y-2 mb-4">
          {situation.actors.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between border p-3 rounded-lg"
            >
              <span>{a.name}</span>
              <button
                onClick={() => deleteActor(a.id)}
                className="text-red-600 hover:bg-red-50 p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
            placeholder="Actor name"
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            onClick={addActor}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </section>

      {/* LINES */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Lines</h2>

        <div className="space-y-2 mb-4">
          { situation.lines.map((l) => (
            <div
              key={l.id}
              className="border p-4 rounded-lg space-y-3"
            >
              {/* Line header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold">
                    #{l.order} — {l.actor.name}
                  </p>
                  <p className="text-gray-700">{l.text}</p>
                </div>

                <button
                  onClick={() => deleteLine(l.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Voices */}
              <div className="ml-4 space-y-2">
                {l.voices.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                  >
                    <span className="font-medium">{v.accent}</span>

                    <div className="flex items-center gap-2">
                      <audio controls src={v.audio_src} className="h-8" />

                      <button
                        onClick={() => deleteVoice(v.id)}
                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Voice */}
              {activeLineId === l.id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()

                    const formData = new FormData(e.target)
                    formData.append('line_id', l.id)

                    await fetch('/api/admin/talkrehearsel/voices', {
                      method: 'POST',
                      body: formData
                    })

                    setVoiceAccent('')
                    setActiveLineId(null)
                    fetchSituation()
                    toast.success('Voice added')
                  }}
                  className="ml-4 flex gap-2 items-center"
                >
                  <select
                    name="accent"
                    required
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Accent</option>
                    <option value="en-IN">en-IN</option>
                    <option value="en-US">en-US</option>
                    <option value="en-GB">en-GB</option>
                  </select>

                  <input
                    type="file"
                    name="audio"
                    accept="audio/*"
                    required
                    className="text-sm"
                  />

                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 text-white rounded"
                  >
                    Upload
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLineId(null)}
                    className="px-3 py-1 border rounded"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setActiveLineId(l.id)}
                  className="ml-4 text-sm text-indigo-600 underline"
                >
                  + Add Voice
                </button>
              )}

            </div>
          ))}

        </div>

        {/* Add Line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select
            value={lineActor}
            onChange={(e) => setLineActor(e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option value="">Select actor</option>
            {situation.actors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <input
            value={lineOrder}
            onChange={(e) => setLineOrder(e.target.value)}
            placeholder="Order"
            type="number"
            className="border rounded px-2 py-2"
          />

          <input
            value={lineText}
            onChange={(e) => setLineText(e.target.value)}
            placeholder="Line text"
            className="border rounded px-2 py-2 col-span-2"
          />

          <button
            onClick={addLine}
            className="md:col-span-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Add Line
          </button>
        </div>
      </section>
    </main>
  )
}
