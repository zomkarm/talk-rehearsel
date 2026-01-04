"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/store/globalStore";
import LeftParticleBackground from "@/components/ui/shared/LeftParticleBackground";

export default function AdminSigninPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const showLoader = useGlobalStore((s) => s.showLoader);
  const hideLoader = useGlobalStore((s) => s.hideLoader);

  async function handleSubmit(e) {
    e.preventDefault();
    showLoader("Signing In...");

    // Basic validation
    if (!form.email) return setErrors({ email: "Email is required" });
    if (!form.password) return setErrors({ password: "Password is required" });

    const res = await fetch("/api/admin/signin", {
      method: "POST",
      body: JSON.stringify(form),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      hideLoader();
      setErrors({ general: "Invalid admin credentials." });
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Intro Section */}
      <div className="relative hidden md:flex items-center justify-center bg-gray-900 overflow-hidden">
        <LeftParticleBackground />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-teal-100 to-indigo-200 bg-clip-text text-transparent">
            Admin Portal
          </h2>
          <p className="mt-4 text-gray-300 max-w-sm mx-auto">
            Secure access for administrators. Manage users, content, and system
            settings.
          </p>
        </div>
      </div>

      {/* Right: Admin Sign In Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl pb-2 sm:text-4xl font-extrabold bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Sign in
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your admin credentials to continue.
            </p>
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 text-center">{errors.general}</p>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="admin@example.com"
              required
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              required
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition"
          >
            Sign in
          </button>

          {/* No signup link for admins */}
          <div className="text-sm text-center text-gray-600">
            <p>
              <a href="#" className="text-teal-600 hover:underline">
                Forgot password?
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
