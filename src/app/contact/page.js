"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateContact } from "@/lib/validations/validateContact";
import { useGlobalStore } from '@/store/globalStore'
import LeftParticleBackground from "@/components/ui/shared/LeftParticleBackground";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", description: "" });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)


  async function handleSubmit(e) {
    showLoader()
    try{
      setSubmitSuccess(false);
      e.preventDefault();
      const errs = validateContact(form);
      if (Object.keys(errs).length) return setErrors(errs);

      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setForm({ name: "", email: "", description: "" });
      } else setErrors({ general: "Contact failed. Please try after some time." });
    } catch(err){
      console.error("Contact Submit error : ",err)
    } finally{
      hideLoader()
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Blob Animation (hidden on mobile) */}

      <div className="relative hidden md:flex items-center justify-center 
                      bg-violet-900 overflow-hidden">
        <LeftParticleBackground />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-teal-100 to-indigo-200 bg-clip-text text-transparent">
            Let’s Talk
          </h2>
          <p className="mt-4 text-gray-200 max-w-sm mx-auto">
            Have questions, feedback, or ideas? We’d love to hear from you.
          </p>
        </div>
      </div>


      {/* Right: Contact Form (no container) */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-8"
          >
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                Contact Us
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Feel free to contact us regarding your queries.
              </p>
            </div>

            {errors.general && (
              <p className="text-sm text-red-600 text-center">{errors.general}</p>
            )}

            {submitSuccess && (
              <p className="text-sm font-bold text-green-600 text-center animate-pulse">
                Thanks for reaching us, we will contact you asap
              </p>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="John Doe"
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`mt-2 block w-full px-4 py-3 text-sm rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Let us know how we can help"
                required
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              aria-label="Submit contact form"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition"
            >
              Submit
            </button>
          </form>

      </div>
    </main>
  );
}
