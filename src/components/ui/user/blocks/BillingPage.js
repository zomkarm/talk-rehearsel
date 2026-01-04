'use client'

import { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { Crown, CreditCard } from 'lucide-react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch('/api/subscription/details', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch subscription details')
        const data = await res.json()
        setSubscriptions(data.subscriptions || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [])

  // Flatten all payments across subscriptions
  const allPayments = subscriptions.flatMap(sub => sub.payments.map(p => ({ ...p, planTitle: sub.planTitle })))

  return (
    <main className="flex-1 bg-white p-6 mt-2 border-2 rounded-tl-xl overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
        Billing
      </h1>

      {loading && <p className="text-gray-500">Loading billing details…</p>}

      {!loading && (
        <Tab.Group>
          <Tab.List className="flex space-x-4 border-b mb-6">
            {['Subscriptions', 'Payments'].map(tab => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
                    selected
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Subscriptions Tab */}
            <Tab.Panel>
              {subscriptions.length === 0 ? (
                <p className="text-sm text-gray-500">No subscriptions found.</p>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="text-teal-600" size={18} />
                        <h2 className="text-md font-semibold text-gray-800">{sub.planTitle}</h2>
                      </div>
                      <p className="text-sm text-gray-600">
                        Status: <span className="font-medium">{sub.status}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: {sub.planPrice} {sub.planCurrency} {sub.planBillingCycle && ` / ${sub.planBillingCycle}`}
                      </p>
                      {sub.currentPeriodEnd && (
                        <p className="text-sm text-gray-600">
                          Current period ends: {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>

            {/* Payments Tab */}
            <Tab.Panel>
              {allPayments.length === 0 ? (
                <p className="text-sm text-gray-500">No payments found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Plan</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        {/*<th className="px-4 py-2 text-left">Receipt</th>*/}
                      </tr>
                    </thead>
                    <tbody>
                      {allPayments.map(p => (
                        <tr key={p.id} className="border-t">
                          <td className="px-4 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{p.planTitle}</td>
                          <td className="px-4 py-2">
                            {p.amount} {p.currency}
                          </td>
                          <td className="px-4 py-2">{p.status}</td>
                          {/*<td className="px-4 py-2">
                            {p.receiptUrl ? (
                              <a
                                href={p.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>*/}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </main>
  )
}
