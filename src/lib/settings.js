import prisma from '@/lib/prisma/client'

const cache = new Map()

export async function getSetting(key) {
  // Check in-memory cache first
  if (cache.has(key)) return cache.get(key)

  // Fetch from DB
  const setting = await prisma.setting.findUnique({
    where: { key },
  })

  if (!setting) return null

  // Cache it for future calls
  cache.set(key, setting.value)
  return setting.value
}

export async function loadSettings(keys) {
  const result = {}
  for (const key of keys) {
    result[key] = await getSetting(key)
  }
  return result
}
