import { useState, useEffect } from 'react'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

export function useRecipeRating(recipeId: number) {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
    userRating: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRatingData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/ratings/`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setRatingData(data)
      } else {
        throw new Error('Failed to fetch rating data')
      }
    } catch (error) {
      setError('Error fetching rating data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRatingData()
  }, [recipeId])

  const updateRating = (newRating: number) => {
    setRatingData(prev => ({
      ...prev,
      userRating: newRating,
      totalRatings: prev.userRating ? prev.totalRatings : prev.totalRatings + 1,
      averageRating: calculateNewAverage(prev, newRating)
    }))
  }

  const calculateNewAverage = (prev: RatingData, newRating: number) => {
    if (!prev.userRating) {
      return ((prev.averageRating * prev.totalRatings) + newRating) / (prev.totalRatings + 1)
    }
    return prev.averageRating
  }

  return {
    ...ratingData,
    loading,
    error,
    updateRating
  }
}