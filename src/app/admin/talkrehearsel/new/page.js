'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AddSituation() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const createSituation = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/admin/talkrehearsel/situations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create situation')
      }

      toast.success('Situation created')

      // Redirect to ManageSituation
      router.push(`/admin/talkrehearsel/${data.situation.id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 bg-white p-6 rounded-tl-3xl overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Situation</h1>
        <p className="text-gray-600">
          Create a new conversation scenario for TalkRehearsel
        </p>
      </div>

      {/* Form */}
      <div className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Job Interview – Introduction"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Context shown to users before practice"
            className="w-full border rounded px-3 py-2 min-h-[100px]"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={createSituation}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Create Situation
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  )
}
