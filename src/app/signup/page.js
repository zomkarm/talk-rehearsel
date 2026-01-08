"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/ui/guest/blocks/Header'
import { validateSignup } from '@/lib/validations/validateUser'
import { useGlobalStore } from '@/store/globalStore'
import LeftParticleBackground from "@/components/ui/shared/LeftParticleBackground";

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)

  async function handleSubmit(e) {
    e.preventDefault()
    showLoader("Creating your account…")
    const errs = validateSignup(form)
    if (Object.keys(errs).length) return setErrors(errs)

    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) router.push('/dashboard')
    else {
      hideLoader()
      setErrors({ general: 'Signup failed. Please try again.' })
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Welcome Section */}
      <div className="relative hidden md:flex items-center justify-center bg-violet-900 overflow-hidden">
        <LeftParticleBackground />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-teal-100 to-indigo-200 bg-clip-text text-transparent">
            Join TalkRehearsel
          </h2>
          <p className="mt-4 text-gray-300 max-w-sm mx-auto">
            Create your account and start building with clarity‑first tools.  
            Unlock your learning space and projects today.
          </p>
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-8"
        >
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Join us today! It only takes a minute.
            </p>
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 text-center">{errors.general}</p>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your name"
              required
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
              required
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              required
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition"
          >
            Sign Up
          </button>

          {/*<button
  type="button"
  onClick={() => (window.location.href = '/api/auth/google')}
  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:shadow-md hover:scale-[1.01] transition"
>
  
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.94 0 7.46 1.36 10.25 3.6l7.65-7.65C37.6 1.9 31.2 0 24 0 14.6 0 6.2 5.4 2.5 13.3l8.9 6.9C13.6 14.1 18.4 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.4 5.6-5.1 7.3l7.9 6.1c4.6-4.2 7-10.4 7-17.9z"
    />
    <path
      fill="#FBBC05"
      d="M11.4 28.2c-1-2.9-1-6.1 0-9l-8.9-6.9C.9 15.6 0 19.7 0 24s.9 8.4 2.5 11.7l8.9-7.5z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.5 0 12-2.1 16-5.7l-7.9-6.1c-2.2 1.5-5 2.4-8.1 2.4-5.6 0-10.4-3.8-12.1-9l-8.9 7.5C6.2 42.6 14.6 48 24 48z"
    />
  </svg>
  <span>Sign Up with Google</span>
</button>*/}



          {/* Footer */}
          <div className="text-sm text-center text-gray-600">
            <p>
              Already have an account?{' '}
              <a href="/login" className="text-teal-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
