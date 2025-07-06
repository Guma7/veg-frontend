import { useState, useEffect, useCallback } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

class ProfileCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.expiry) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Invalidar cache baseado em padrão
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys())
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    })
  }
}

const profileCache = new ProfileCache()

export const useProfileCache = () => {
  const [cacheVersion, setCacheVersion] = useState(0)

  const getCachedData = useCallback(<T>(key: string): T | null => {
    return profileCache.get<T>(key)
  }, [cacheVersion])

  const setCachedData = useCallback(<T>(key: string, data: T, ttl?: number): void => {
    profileCache.set(key, data, ttl)
    setCacheVersion(prev => prev + 1)
  }, [])

  const invalidateCache = useCallback((key: string): void => {
    profileCache.invalidate(key)
    setCacheVersion(prev => prev + 1)
  }, [])

  const invalidatePattern = useCallback((pattern: string): void => {
    profileCache.invalidatePattern(pattern)
    setCacheVersion(prev => prev + 1)
  }, [])

  const clearCache = useCallback((): void => {
    profileCache.clear()
    setCacheVersion(prev => prev + 1)
  }, [])

  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    invalidatePattern,
    clearCache
  }
}

export default useProfileCache