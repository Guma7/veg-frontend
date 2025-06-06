'use client'
import styled from 'styled-components'
import { useState } from 'react'
import { Alert } from '../ui/Alert'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const RatingButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const RatingButton = styled.button<{ isSelected: boolean }>`
  padding: 5px 10px;
  border: 1px solid ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.isSelected ? props.theme.colors.primary : 'white'};
  color: ${props => props.isSelected ? 'white' : props.theme.colors.text};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.9em;
  color: ${props => props.theme.colors.text.secondary};
`

const AverageRating = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
`

interface RatingSystemProps {
  recipeId: number;
  initialRating?: number;
  averageRating: number;
  totalRatings: number;
  onRatingSubmit: (rating: number) => void;
}

export default function RatingSystem({ 
  recipeId, 
  initialRating, 
  averageRating,
  totalRatings,
  onRatingSubmit 
}: RatingSystemProps) {
  const [selectedRating, setSelectedRating] = useState(initialRating || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasRated, setHasRated] = useState(!!initialRating)

  const handleRating = async (rating: number) => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/rate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: rating }),
        credentials: 'include'
      })

      if (response.ok) {
        setSelectedRating(rating)
        setHasRated(true)
        onRatingSubmit(rating)
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao avaliar receita')
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RatingContainer>
      {error && <Alert $variant="error">{error}</Alert>}
      
      <RatingInfo>
        <span>Avaliação média: <AverageRating>{averageRating.toFixed(1)}</AverageRating></span>
        <span>Total de avaliações: {totalRatings}</span>
      </RatingInfo>

      <RatingButtons>
        {[...Array(10)].map((_, index) => (
          <RatingButton
            key={index + 1}
            isSelected={selectedRating === index + 1}
            onClick={() => handleRating(index + 1)}
            disabled={loading || (hasRated && selectedRating !== index + 1)}
          >
            {index + 1}
          </RatingButton>
        ))}
      </RatingButtons>

      {hasRated && (
        <span style={{ fontSize: '0.9em', color: '#666' }}>
          Você já avaliou esta receita
        </span>
      )}
    </RatingContainer>
  )
}