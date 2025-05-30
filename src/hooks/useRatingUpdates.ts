import { useState, useEffect } from 'react'

export function useRatingUpdates(recipeId: string) {
  const [ratings, setRatings] = useState({ average: 0, total: 0 })

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:8000/api/recipes/${recipeId}/rating-updates/`
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