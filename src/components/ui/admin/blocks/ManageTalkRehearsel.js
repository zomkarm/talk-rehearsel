'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ManageTalkRehearsel() {
  const router = useRouter()

  const [situations, setSituations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const limit = 5

  // Fetch situations with pagination
  const fetchSituations = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/admin/talkrehearsel/situations?page=${pageNum}&limit=${limit}`
      )
      const data = await res.json()

      setSituations(data.situations || [])
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
      setError('Failed to load situations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSituations(page)
  }, [page])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `/api/admin/talkrehearsel/situations?id=${id}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error('Delete failed')

      toast.success('Situation deleted')
      fetchSituations(page)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete situation')
    }
  }

  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Delete this situation? All actors and lines will be removed.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDelete(id)
                toast.dismiss(t)
              }}
              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  }

  return (
    <main className="flex-1 bg-white p-6 mt-2 rounded-tl-3xl overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Manage TalkRehearsel
        </h1>

        <button
          onClick={() => router.push('/admin/talkrehearsel/new')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
        >
          + Add Situation
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  Loading situations...
                </td>
              </tr>
            ) : situations.length > 0 ? (
              situations.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    {s.description || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/talkrehearsel/${s.id}`)
                      }
                      className="p-2 rounded-md text-green-600 hover:bg-green-50"
                      title="Manage"
                    >
                      <ArrowRight size={16} />
                    </button>

                    <button
                      onClick={() => confirmDelete(s.id)}
                      className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  No situations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  )
}
