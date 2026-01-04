'use client'
import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ManageContact() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 5

  // Fetch contacts with pagination
  const fetchContacts = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/contact?page=${pageNum}&limit=${limit}`)
      const data = await res.json()
      setContacts(data.contacts || [])
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts(page)
  }, [page])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete contact')

      toast.success('Contact deleted successfully')
      await fetchContacts(page)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete contact')
    }
  }

  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Are you sure you want to delete this contact?</p>
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
        <h1 className="text-xl font-bold text-gray-800">Manage Contact Queries</h1>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Contacts Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  Loading contacts...
                </td>
              </tr>
            ) : contacts.length > 0 ? (
              contacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{c.name || '-'}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{c.description}</td>
                  <td className="px-4 py-3">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => toast.info('Edit functionality coming soon')}
                      className="p-2 rounded-md text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(c.id)}
                      className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No contact queries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  )
}
