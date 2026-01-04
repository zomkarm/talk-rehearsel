'use client'
import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ManageSubscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [pricingPlans, setPricingPlans] = useState([])
  const [formData, setFormData] = useState({
    id: null,
    userId: '',
    planTitle: '',
    planPrice: '',
    planCurrency: 'USD',
    planBillingCycle: '',
    status: 'ACTIVE',
    currentPeriodStart: '',
    currentPeriodEnd: '',
    cancelAtPeriodEnd: false,
  })

  const limit = 10

  // Fetch subscriptions with pagination
  const fetchSubs = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/subscriptions?page=${pageNum}&limit=${limit}`)
      const data = await res.json()
      setSubs(data.data || [])
      //console.log(data.data)
      setPage(data.pagination?.page || 1)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

	useEffect(() => {
	  async function fetchPricing() {
	  	try{
		    const res = await fetch('/api/admin/pricing')
		    const data = await res.json()
		    console.log(data.plans)
		    setPricingPlans(data.plans || [])
			console.log(pricingPlans)
		    
		} catch(err){
			console.error(err)
		}
	  }
	  fetchPricing()
	}, [])

  useEffect(() => {
    fetchSubs(page)
  }, [page])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = formData.id ? 'PUT' : 'POST'
      const url = '/api/admin/subscriptions' + (formData.id ? `?id=${formData.id}` : '')

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to save subscription')

      toast.success(formData.id ? 'Subscription updated' : 'Subscription created')
      await fetchSubs(page)
      setShowForm(false)
      setFormData({
        id: null,
        userId: '',
        planTitle: '',
        planPrice: '',
        planCurrency: 'USD',
        planBillingCycle: '',
        status: 'ACTIVE',
        currentPeriodStart: '',
        currentPeriodEnd: '',
        cancelAtPeriodEnd: false,
      })
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/subscriptions?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete subscription')
      toast.success('Subscription deleted')
      await fetchSubs(page)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete subscription')
    }
  }

  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Are you sure you want to delete this subscription?</p>
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
        <h1 className="text-xl font-bold text-gray-800">Manage Subscriptions</h1>
        <button
          onClick={() => {
            setFormData({
              id: null,
              userId: '',
              planTitle: '',
              planPrice: '',
              planCurrency: 'USD',
              planBillingCycle: '',
              status: 'ACTIVE',
              currentPeriodStart: '',
              currentPeriodEnd: '',
              cancelAtPeriodEnd: false,
            })
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          + Create Subscription
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Currency</th>
              <th className="px-4 py-3 text-left">Cycle</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  Loading subscriptions...
                </td>
              </tr>
            ) : subs.length > 0 ? (
              subs.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
					  <div className="flex flex-col">
					    <span className="font-medium text-gray-800">
					      {s.user?.name || s.user?.email || '—'}
					    </span>
					    <span className="text-xs text-gray-500">ID: {s.user?.id}</span>
					  </div>
					</td>

                  <td className="px-4 py-3">{s.planTitle}</td>
                  <td className="px-4 py-3">{s.planPrice}</td>
                  <td className="px-4 py-3">{s.planCurrency}</td>
                  <td className="px-4 py-3">{s.planBillingCycle || '-'}</td>
                  <td className="px-4 py-3">{s.status}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setFormData({
                          id: s.id,
                          userId: s.userId,
                          planTitle: s.planTitle,
                          planPrice: s.planPrice,
                          planCurrency: s.planCurrency,
                          planBillingCycle: s.planBillingCycle || '',
                          status: s.status,
                          currentPeriodStart: s.currentPeriodStart || '',
                          currentPeriodEnd: s.currentPeriodEnd || '',
                          cancelAtPeriodEnd: s.cancelAtPeriodEnd || false,
                        })
                        setShowForm(true)
                      }}
                      className="p-2 rounded-md text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
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
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No subscriptions found
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
                {formData.id ? ' Edit Subscription' : ' Add Subscription'}
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                {/* Pricing Plan Selector */}
				<div>
				  <label className="block text-sm font-medium text-gray-600 mb-1">Select Pricing Plan</label>
				  <select
				    value={formData.planId || ''}
				    onChange={(e) => {
				      const selected = pricingPlans.find(p => String(p.id) === e.target.value)
				      if (!selected) return
				      setFormData({
				        ...formData,
				        planId: selected.id,
				        planTitle: selected.title,
				        planPrice: selected.price,
				        planCurrency: selected.currency,
				        planBillingCycle: selected.billingCycle,
				      })
				    }}
				    className="w-full px-4 py-2 border rounded-lg"
				  >
				    <option value="">-- Select a plan --</option>
				    {pricingPlans.map(p => (
				      <option key={p.id} value={p.id}>
				        {p.title} ({p.currency} {p.price}/{p.billingCycle})
				      </option>
				    ))}
				  </select>
				</div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Plan Title</label>
                  <input
                    type="text"
                    value={formData.planTitle}
                    onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.planPrice}
                    onChange={(e) => setFormData({ ...formData, planPrice: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Currency</label>
                  <input
                    type="text"
                    value={formData.planCurrency}
                    onChange={(e) => setFormData({ ...formData, planCurrency: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Billing Cycle</label>
                  <input
                    type="text"
                    value={formData.planBillingCycle}
                    onChange={(e) => setFormData({ ...formData, planBillingCycle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="TRIALING">TRIALING</option>
                  <option value="PAST_DUE">PAST_DUE</option>
                  <option value="CANCELED">CANCELED</option>
                  <option value="INCOMPLETE">INCOMPLETE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Period Start</label>
                  <input
                    type="date"
                    value={formData.currentPeriodStart?.slice(0, 10) || ''}
                    onChange={(e) => setFormData({ ...formData, currentPeriodStart: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Period End</label>
                  <input
                    type="date"
                    value={formData.currentPeriodEnd?.slice(0, 10) || ''}
                    onChange={(e) => setFormData({ ...formData, currentPeriodEnd: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cancelAtPeriodEnd"
                  checked={formData.cancelAtPeriodEnd}
                  onChange={(e) => setFormData({ ...formData, cancelAtPeriodEnd: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="cancelAtPeriodEnd" className="text-sm text-gray-700">
                  Cancel at period end
                </label>
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
                  {formData.id ? 'Update Subscription' : 'Create Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
