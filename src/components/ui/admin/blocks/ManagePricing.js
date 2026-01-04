'use client'
import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ManagePricing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    billingCycle: 'monthly',
    features: '',
    badge: '',
    ctaLabel: '',
    theme: '',
    isActive: true,
    lsProductId: '',
    lsVariantId: '',
    lsCheckoutUrl: '',
  })

  const limit = 5

  // Fetch pricing plans with pagination
  const fetchPlans = async (pageNum = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/pricing?page=${pageNum}&limit=${limit}`)
      const data = await res.json()
      setPlans(data.plans || [])
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Failed to load pricing plans')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = formData.id ? 'PUT' : 'POST'
      const url = '/api/admin/pricing' + (formData.id ? `?id=${formData.id}` : '')

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          features: formData.features
            ? formData.features.split(',').map((f) => f.trim())
            : [],
        }),
      })

      if (!res.ok) throw new Error('Failed to save plan')

      toast.success(formData.id ? 'Plan updated successfully' : 'Plan created successfully')
      await fetchPlans(page)
      setShowForm(false)
      setFormData({
        id: null,
        title: '',
        description: '',
        price: '',
        currency: 'USD',
        billingCycle: 'monthly',
        features: '',
        badge: '',
        ctaLabel: '',
        theme: '',
        isActive: true,
        lsProductId: '',
        lsVariantId: '',
        lsCheckoutUrl: '',
      })
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }


  useEffect(() => {
    fetchPlans(page)
  }, [page])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/pricing?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete plan')

      toast.success('Plan deleted successfully')
      await fetchPlans(page)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete plan')
    }
  }

  const confirmDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Are you sure you want to delete this plan?</p>
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
        <h1 className="text-xl font-bold text-gray-800">Manage Pricing Plans</h1>
        <button
          onClick={() => {
                        setFormData({
                          id: null,
                          title: '',
                          description: '',
                          price: '',
                          currency: 'USD',
                          billingCycle: 'monthly',
                          features: '',
                          badge: '',
                          ctaLabel: '',
                          theme: '',
                          isActive: true,
                          lsProductId: '',
                          lsVariantId: '',
                          lsCheckoutUrl: '',
                        })
                        setShowForm(true)
                      }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          + Create Plan
        </button>
      </div>


      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Pricing Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Billing</th>
              <th className="px-4 py-3 text-left">Badge</th>
              <th className="px-4 py-3 text-left">Theme</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  Loading plans...
                </td>
              </tr>
            ) : plans.length > 0 ? (
              plans.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{p.description}</td>
                  <td className="px-4 py-3">
                    {p.currency} {p.price}
                  </td>
                  <td className="px-4 py-3">{p.billingCycle}</td>
                  <td className="px-4 py-3">{p.badge || '-'}</td>
                  <td className="px-4 py-3">{p.theme || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setFormData({
                          id: p.id,
                          title: p.title,
                          description: p.description || '',
                          price: p.price,
                          currency: p.currency,
                          billingCycle: p.billingCycle,
                          features: p.features?.join(', ') || '',
                          badge: p.badge || '',
                          ctaLabel: p.ctaLabel || '',
                          theme: p.theme || '',
                          isActive: p.isActive,
                          lsProductId: p.lsProductId || '',
                          lsVariantId: p.lsVariantId || '',
                          lsCheckoutUrl: p.lsCheckoutUrl || '',
                        })
                        setShowForm(true)
                      }}
                      className="p-2 rounded-md text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => confirmDelete(p.id)}
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
                  No pricing plans found
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-6 transform animate-scaleIn 
                max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                {formData.id ? '✏️ Edit Plan' : '➕ Add Plan'}
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
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter plan title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>

              {/* Price + Billing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                  <input
                    type="number"
                    placeholder="e.g. 29"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Billing Cycle</label>
                  <input
                    type="text"
                    placeholder="monthly / annual"
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Currency</label>
                <input
                  type="text"
                  placeholder="USD"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Features</label>
                <input
                  type="text"
                  placeholder="Comma separated features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  placeholder="Short description of the plan"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Badge + CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">CTA Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Upgrade Now"
                    value={formData.ctaLabel}
                    onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Theme</label>
                <input
                  type="text"
                  placeholder="blue / gray / green"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              {/* Lemon Squeezy Product ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">LS Product ID (LS - Lemon Squeezy)</label>
                <input
                  type="text"
                  placeholder="Enter LS Product ID"
                  value={formData.lsProductId}
                  onChange={(e) => setFormData({ ...formData, lsProductId: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Lemon Squeezy Variant ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">LS Variant ID</label>
                <input
                  type="text"
                  placeholder="Enter LS Variant ID"
                  value={formData.lsVariantId}
                  onChange={(e) => setFormData({ ...formData, lsVariantId: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Lemon Squeezy Checkout URL */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">LS Checkout URL</label>
                <input
                  type="text"
                  placeholder="Optional fallback checkout link"
                  value={formData.lsCheckoutUrl}
                  onChange={(e) => setFormData({ ...formData, lsCheckoutUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                  {formData.id ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </main>
  )
}
