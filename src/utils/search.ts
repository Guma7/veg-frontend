export interface Recipe {
  id: string;
  title: string;
  slug: string;
  recipe_class: string;
  genre: string;
  style: string;
  ingredients: string | Array<{name: string, quantity: string, unit: string}>;
  instructions: string;
  nutritional_level?: string;
  does_not_contain?: string;
  traditional?: string;
  youtube_link?: string;
  image?: string;
  image_url?: string;
  author?: {
    username: string;
    profileImage?: string;
  };
  averageRating?: number;
  average_rating?: number;
  totalRatings?: number;
  total_ratings?: number;
  createdAt?: string;
  created_at?: string;
  views_count?: number;
}

// Then define a proper generic Cache class
class Cache<T> {
  private data: Record<string, {value: T, timestamp: number}> = {}
  private ttl: number // in minutes

  constructor(ttl: number) {
    this.ttl = ttl
  }

  get(key: string): T | undefined {
    const item = this.data[key]
    if (!item) return undefined
    
    const isExpired = (Date.now() - item.timestamp) > this.ttl * 60 * 1000
    return isExpired ? undefined : item.value
  }

  set(key: string, value: T): void {
    this.data[key] = {
      value,
      timestamp: Date.now()
    }
  }
}

export interface SearchResult {
  exact: Recipe[]
  similar: Recipe[]
  total: number
}

export async function searchRecipes(params: URLSearchParams): Promise<SearchResult> {
  const cache = new Cache<SearchResult>(5)
  const cacheKey = params.toString()
  
  const cachedResult = cache.get(cacheKey)
  if (cachedResult) return cachedResult

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
  cache.set(cacheKey, data)
  
  return data
}