"use client";

import { useEffect, useState } from "react";
import Header from "@/components/ui/guest/blocks/Header";
import Footer from "@/components/ui/guest/blocks/Footer";
import { useGlobalStore } from '@/store/globalStore'
import { toast } from 'sonner'

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [lsMode, setLsMode] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('Free')

  const isLoggedIn = useGlobalStore(state => state.isLoggedIn);
  const fetchUserStatus = useGlobalStore(state => state.fetchUserStatus);

  // Check login status on mount
  useEffect(() => {
    fetchUserStatus();
  }, [fetchUserStatus]);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch('/api/subscription/status', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        //console.log(data)
        if (data.status && data.planTitle && data.planTitle.toLowerCase() !== 'free') {
          setSelectedPlan(data.planTitle.toLowerCase())
        } else {
          setSelectedPlan('free')
        }

      } catch (err) {
        console.error('Error fetching subscription:', err)
      }
    }
    fetchPlan()
  }, [])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/pricing");
        const data = await res.json();
        setPlans(data.plans || []);
        setProvider(data.provider || null);
        setLsMode(data.lsMode || null);
      } catch (err) {
        console.error("Failed to load pricing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePurchase = async (planId,variantId) => {
    if (!isLoggedIn) {
      // Not logged in → redirect to login
      toast.error("Please log in to continue with your purchase.")
      window.location.href = "/login"
      return
    }

    try {
      // Call your purchase API route
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: planId ,productId: variantId }),
      })

      if (!res.ok) throw new Error("Failed to create checkout")

      const { url } = await res.json()
      if (url) {
        // Redirect user to Lemon Squeezy checkout
        window.location.href = url
      }else{
        toast.error("We couldn’t start your checkout. Please try again in a moment")
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.")
      console.error("Purchase error:", err)
    }
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Header */}
        <Header />

        {/* Title */}
        <div className="text-center mt-12">
          {/* Environment Label – only show in test or none */}
          {(provider === "None") && (
            <div className="mb-4 flex justify-center pt-6">
              <span
                className={`px-3 py-1 text-md font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300`}
              >Test Mode
              </span>
            </div>
          )}

          <h3 className="text-3xl sm:text-4xl md:text-5xl py-6 font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Choose the plan that fits your learning journey
          </h3>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent pricing. No hidden costs. Whether you’re just starting out or ready to unlock advanced features, each plan gives you clarity and value to grow.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {loading ? (
            <p className="col-span-3 text-center text-gray-500">Loading plans...</p>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl shadow-xl p-8 flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.theme === "blue"
                    ? "bg-white border-2 border-blue-500"
                    : plan.theme === "green"
                    ? "bg-white/80 backdrop-blur-md"
                    : "bg-white/80 backdrop-blur-md"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </span>
                )}

                <h2 className="text-xl font-semibold text-gray-800">{plan.title}</h2>
                <p className="mt-2 text-gray-600">{plan.description}</p>

                <p className="mt-6 text-4xl font-bold text-gray-900">
                  ${plan.price}
                  {plan.billingCycle === "monthly" && (
                    <span className="text-lg font-medium">/mo</span>
                  )}
                  {plan.billingCycle === "annual" && (
                    <span className="text-lg font-medium">/yr</span>
                  )}
                </p>

                {/* Optional discount text */}
                {plan.billingCycle === "annual" && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Save 37%
                  </p>
                )}

                <ul className="mt-6 space-y-3 text-gray-700 text-sm sm:text-base">
                  {plan.features.map((f, i) => (
                    <li key={i}>✔ {f}</li>
                  ))}
                </ul>

                {/* Case 1: Logged out → show all buttons */}
                {!isLoggedIn && (
                  <button
                    onClick={() => handlePurchase(plan.id, plan.lsVariantId)}
                    className={`mt-auto w-full rounded-lg text-white py-3 font-medium hover:opacity-90 transition ${
                      plan.theme === "blue"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500"
                        : plan.theme === "green"
                        ? "bg-gradient-to-r from-emerald-500 to-green-600"
                        : "bg-gradient-to-r from-gray-700 to-gray-900"
                    }`}
                  >
                    {plan.ctaLabel || "Choose Plan"}
                  </button>
                )}

                {/* Case 2: Logged in + Free user */}
                {isLoggedIn && selectedPlan === "free" && (
                  plan.title.toLowerCase() === "free" ? (
                    <button
                      disabled
                      className="mt-auto w-full rounded-lg text-white py-3 font-medium bg-gradient-to-r from-gray-500 to-gray-700"
                    >
                      Subscribed
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(plan.id, plan.lsVariantId)}
                      className={`mt-auto w-full rounded-lg text-white py-3 font-medium hover:opacity-90 transition ${
                        plan.theme === "blue"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500"
                          : plan.theme === "green"
                          ? "bg-gradient-to-r from-emerald-500 to-green-600"
                          : "bg-gradient-to-r from-gray-700 to-gray-900"
                      }`}
                    >
                      {plan.ctaLabel || "Choose Plan"}
                    </button>
                  )
                )}

                {/* Case 3: Logged in + Paid plan */}
                {isLoggedIn && selectedPlan !== "free" && selectedPlan === plan.title.toLowerCase() && (
                  <button
                    disabled
                    className="mt-auto w-full rounded-lg text-white py-3 font-medium bg-gradient-to-r from-blue-600 to-cyan-500"
                  >
                    Subscribed
                  </button>
                )}

              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
