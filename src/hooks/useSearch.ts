import { useState, useCallback } from 'react'
import { searchCache } from '../utils/searchCache'
import { Recipe } from '../types/recipe'

interface SearchResults {
  exact: Recipe[]
  similar: Recipe[]
  loading: boolean
  error: string | null
}

export function useSearch() {
  const [results, setResults] = useState<SearchResults>({
    exact: [],
    similar: [],
    loading: false,
    error: null
  })

  const search = useCallback(async (params: URLSearchParams) => {
    setResults(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Tenta buscar do cache primeiro
      const cached = await searchCache.getResults(params)
      if (cached) {
        setResults({
          exact: cached.exact,
          similar: cached.similar,
          loading: false,
          error: null
        })
        return
      }

      // Se não estiver em cache, faz a requisição
      const response = await fetch(`http://localhost:8000/api/recipes/search/?${params}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) throw new Error('Falha na busca')

      const data = await response.json()
      
      // Salva no cache
      searchCache.setResults(params, {
        exact: data.exact,
        similar: data.similar
      })

      setResults({
        exact: data.exact,
        similar: data.similar,
        loading: false,
        error: null
      })
    } catch (error) {
      setResults(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }))
    }
  }, [])

  return { ...results, search }
}