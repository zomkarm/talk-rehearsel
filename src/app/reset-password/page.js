"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LeftParticleBackground from "@/components/ui/shared/LeftParticleBackground";
import { useGlobalStore } from '@/store/globalStore'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)


  async function handleSubmit(e) {
    e.preventDefault();
    showLoader("Resetting you password...")
    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or expired reset link.");
      hideLoader()
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      hideLoader()
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        hideLoader()
        const data = await res.json();
        setError(data.error || "Reset failed. Try again.");
      }
    } catch (err) {
      hideLoader()
      setError("Server error. Please try again later.");
    }
  }

  // If no token, show error immediately
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold text-red-600">Invalid Link</h2>
          <p className="mt-4 text-gray-600">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/forgot-password"
            className="mt-6 inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow hover:scale-[1.01] transition"
          >
            Request New Link
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Intro Section */}
      <div className="relative hidden md:flex items-center justify-center bg-violet-900 overflow-hidden">
        <LeftParticleBackground />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-teal-100 to-indigo-200 bg-clip-text text-transparent">
            Choose a new password
          </h2>
          <p className="mt-4 text-gray-300 max-w-sm mx-auto">
            Enter and confirm your new password below to complete the reset.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl pb-2 sm:text-4xl font-extrabold bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your new password below.
            </p>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-3 text-sm rounded-xl border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-semibold text-gray-800">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-2 block w-full px-4 py-3 text-sm rounded-xl border border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition"
          >
            Reset Password
          </button>

          {/* Feedback */}
          {message && <p className="text-sm text-green-600 text-center">{message}</p>}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* Links */}
          <div className="text-sm text-center text-gray-600 space-y-2">
            <p>
              Back to{" "}
              <a href="/login" className="text-teal-600 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
