import { useState, useEffect } from 'react'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

export function useRatingUpdates(recipeId: string) {
  const [ratings, setRatings] = useState({ average: 0, total: 0 })

  useEffect(() => {
    const eventSource = new EventSource(
      `${API_URL}/api/recipes/${recipeId}/rating-updates/`
    )

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setRatings({
        average: data.average_rating,
        total: data.total_ratings
      })
    }

    return () => {
      eventSource.close()
    }
  }, [recipeId])

  return ratings
}