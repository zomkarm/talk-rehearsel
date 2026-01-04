'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function CheckoutResultPage() {
  const searchParams = useSearchParams()
  const subId = searchParams.get('sub') // safe accessor
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!subId) {
      setStatus('failed')
      return
    }

    let attempts = 0
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/purchase/payment-status?sub=${subId}`)
        const data = await res.json()

        switch (data.paymentStatus) {
          case 'SUCCEEDED':
          case 'ACTIVE':
            setStatus('success')
            clearInterval(interval)
            break
          case 'INCOMPLETE':
          case 'PENDING':
            setStatus('pending')
            break
          default:
            setStatus('failed')
            clearInterval(interval)
        }
      } catch (err) {
        console.error(err)
        setStatus('failed')
        clearInterval(interval)
      }

      attempts++
      if (attempts > 6) {
        clearInterval(interval)
        if (status === 'pending' || status === 'loading') {
          setStatus('failed')
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [subId])

  const Wrapper = ({ children, bg }) => (
    <div className={`flex items-center justify-center h-screen bg-gradient-to-br ${bg}`}>
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full text-center animate-fadeIn">
        {children}
        <Link
          href="/dashboard"
          className="mt-6 inline-block px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )

  if (status === 'loading' || status === 'pending') {
    return (
      <Wrapper bg="from-gray-100 to-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-6"></div>
        <h1 className="text-xl font-semibold text-gray-800">Processing your payment…</h1>
        <p className="mt-2 text-gray-500">Please wait a moment while we confirm.</p>
      </Wrapper>
    )
  }

  if (status === 'success') {
    return (
      <Wrapper bg="from-green-100 to-green-200">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Successful 🎉</h1>
        <p className="mt-2 text-gray-600">Your subscription is now active.</p>
      </Wrapper>
    )
  }

  return (
    <Wrapper bg="from-red-100 to-red-200">
      <div className="text-red-600 text-6xl mb-4">❌</div>
      <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
      <p className="mt-2 text-gray-600">We couldn’t confirm your payment. Please try again.</p>
    </Wrapper>
  )
}
