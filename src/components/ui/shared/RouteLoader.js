"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function RouteLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 500) // short fade time
    return () => clearTimeout(timeout)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-md bg-black/30">
      {/* Spinner */}
      <div className="h-16 w-16 border-[5px] border-blue-500 border-t-transparent rounded-full animate-spin drop-shadow-lg" />

      {/* Label */}
      <p className="mt-4 text-lg font-semibold text-blue-100 sm:text-xl md:text-2xl tracking-wide drop-shadow-sm">
        Loading <span className="text-blue-400">TalkRehearsel</span>
      </p>
    </div>
  )
}
