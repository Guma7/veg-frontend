export interface Recipe {
  id?: number
  title: string
  instructions: string
  ingredients: string
  class: typeof RECIPE_VALIDATION.class.values[number]
  style: typeof RECIPE_VALIDATION.style.values[number]
  genre: string
  youtubeUrl?: string
  images: string[]
  created_at?: string
  updated_at?: string
  author?: {
    id: number
    username: string
  }
  slug?: string
  image_url?: string
  image?: string
  averageRating?: number
}

import { RECIPE_VALIDATION } from '../utils/validation'