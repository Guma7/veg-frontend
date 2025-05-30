import { Cache } from './cache'
import { Recipe } from '../types/recipe'

interface SearchCache {
  results: {
    exact: Recipe[]
    similar: Recipe[]
  }
  timestamp: number
  params: string
}

class SearchCacheManager {
  private cache: Cache<SearchCache>
  private static instance: SearchCacheManager

  private constructor() {
    this.cache = new Cache<SearchCache>(15) // 15 minutos de cache
  }

  static getInstance() {
    if (!SearchCacheManager.instance) {
      SearchCacheManager.instance = new SearchCacheManager()
    }
    return SearchCacheManager.instance
  }

  async getResults(params: URLSearchParams): Promise<SearchCache['results'] | null> {
    const key = params.toString()
    const cached = this.cache.get(key)
    if (cached) return cached.results
    return null
  }

  setResults(params: URLSearchParams, results: SearchCache['results']) {
    this.cache.set(params.toString(), {
      results,
      timestamp: Date.now(),
      params: params.toString()
    })
  }

  clearCache() {
    this.cache.clear()
  }
}

export const searchCache = SearchCacheManager.getInstance()