'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useGlobalStore } from '@/store/globalStore'

export function RouteLoaderController() {
  const pathname = usePathname()
  const hideLoader = useGlobalStore(s => s.hideLoader)

  useEffect(() => {
    hideLoader()
  }, [pathname, hideLoader])

  return null
}
