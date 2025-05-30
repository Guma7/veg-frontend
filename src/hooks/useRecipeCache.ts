import { useState, useEffect } from 'react'
import { Recipe } from '../types/recipe'

interface CacheItem {
  data: Recipe[]
  timestamp: number
  totalPages: number
  totalItems: number
}

interface CacheKey {
  page: number
  filters: Record<string, string>
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function useRecipeCache() {
  const [cache, setCache] = useState<Record<string, CacheItem>>({})

  const getCacheKey = (key: CacheKey): string => {
    return JSON.stringify(key)
  }

  const isCacheValid = (item: CacheItem): boolean => {
    return Date.now() - item.timestamp < CACHE_DURATION
  }

  const getFromCache = (key: CacheKey) => {
    const cacheKey = getCacheKey(key)
    const item = cache[cacheKey]
    
    if (item && isCacheValid(item)) {
      return item
    }
    return null
  }

  const setInCache = (key: CacheKey, data: Recipe[], totalPages: number, totalItems: number) => {
    const cacheKey = getCacheKey(key)
    setCache(prev => ({
      ...prev,
      [cacheKey]: {
        data,
        timestamp: Date.now(),
        totalPages,
        totalItems
      }
    }))
  }

  const clearCache = () => {
    setCache({})
  }

  // Limpa cache expirado periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCache(prev => {
        const newCache = { ...prev }
        Object.entries(newCache).forEach(([key, value]) => {
          if (!isCacheValid(value)) {
            delete newCache[key]
          }
        })
        return newCache
      })
    }, CACHE_DURATION)

    return () => clearInterval(interval)
  }, [])

  return {
    getFromCache,
    setInCache,
    clearCache
  }
}