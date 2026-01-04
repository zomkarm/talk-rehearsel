'use client'
import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ManagePayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    subscriptionId: '',
    provider: '',
    providerPaymentId: '',
    amount: '',
    currency: 'USD',
    status: 'SUCCEEDED',
    receiptUrl: '',
    payload: '',
  })

  const limit = 10

  // Fetch payments with pagination
  const fetchPayments = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/payments?page=${pageNum}&limit=${limit}`)
      const data = await res.json()
      setPayments(data.data || [])
      setPage(data.pagination?.page || 1)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments(page)
  }, [page])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = formData.id ? 'PUT' : 'POST'
      const url = '/api/admin/payments' + (formData.id ? `?id=${formData.id}` : '')

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      if (!res.ok) throw new Error('Failed to save payment')

      toast.success(formData.id ? 'Payment updated' : 'Payment created')
      await fetchPayments(page)
      setShowForm(false)
      setFormData({
        id: null,
        subscriptionId: '',
        provider: '',
        providerPaymentId: '',
        amount: '',
        currency: 'USD',
        status: 'SUCCEEDED',
        receiptUrl: '',
        payload: '',
      })
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/payments?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete payment')
      toast.success('Payment deleted')
      await fetchPayments(page)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete payment')
    }
  }

  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Are you sure you want to delete this payment?</p>
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
        <h1 className="text-xl font-bold text-gray-800">Manage Payments</h1>
        <button
          onClick={() => {
            setFormData({
              id: null,
              subscriptionId: '',
              provider: '',
              providerPaymentId: '',
              amount: '',
              currency: 'USD',
              status: 'SUCCEEDED',
              receiptUrl: '',
              payload: '',
            })
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          + Create Payment
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Subscription</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Provider</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Currency</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.subscription?.planTitle || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {p.subscription?.user?.name || p.subscription?.user?.email || '—'}
                      </span>
                      <span className="text-xs text-gray-500">ID: {p.subscription?.user?.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.provider}</td>
                  <td className="px-4 py-3">{p.amount}</td>
                  <td className="px-4 py-3">{p.currency}</td>
                  <td className="px-4 py-3">{p.status}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setFormData({
                          id: p.id,
                          subscriptionId: p.subscriptionId,
                          provider: p.provider,
                          providerPaymentId: p.providerPaymentId,
                          amount: p.amount,
                          currency: p.currency,
                          status: p.status,
                          receiptUrl: p.receiptUrl || '',
                          payload: p.payload || '',
                        })
                        setShowForm(true)
                      }}
                      className="px-2 py-1 rounded-md text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(p.id)}
                      className="px-2 py-1 rounded-md text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No payments found
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                {formData.id ? '✏️ Edit Payment' : '➕ Add Payment'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Subscription ID</label>
                  <input
                    type="text"
                    value={formData.subscriptionId}
                    onChange={(e) => setFormData({ ...formData, subscriptionId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Provider</label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Provider Payment ID</label>
                  <input
                    type="text"
                    value={formData.providerPaymentId}
                    onChange={(e) => setFormData({ ...formData, providerPaymentId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="SUCCEEDED">SUCCEEDED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Receipt URL</label>
                <input
                  type="text"
                  value={formData.receiptUrl}
                  onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Payload</label>
                <textarea
                  value={formData.payload}
                  onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md hover:opacity-90 transition"
                >
                  {formData.id ? 'Update Payment' : 'Create Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
