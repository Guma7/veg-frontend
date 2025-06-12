'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaStar } from 'react-icons/fa'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const StarsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`

const StarButton = styled.button<{ $filled: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$filled ? props.theme.colors.warning : props.theme.colors.border};
  font-size: 1.5rem;
  transition: transform 0.2s, color 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`

const RatingInfo = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
`

const RatingFeedback = styled.div<{ $isPositive: boolean }>`
  color: ${props => props.$isPositive ? props.theme.colors.success : props.theme.colors.text.secondary};
  font-size: 0.9rem;
  margin-top: ${props => props.theme.spacing.xs};
  text-align: center;
`

interface RatingStarsProps {
  recipeId: string;
  initialRating?: number;
  onRatingSubmit?: (rating: number) => void;
  readonly?: boolean;
}

export function RatingStars({ recipeId, initialRating = 0, onRatingSubmit, readonly = false }: RatingStarsProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [hasRated, setHasRated] = useState(false)

  useEffect(() => {
    setRating(initialRating)
    setHasRated(!!initialRating)
  }, [initialRating])

  const handleRating = async (value: number) => {
    if (readonly || isSubmitting) return

    try {
      setIsSubmitting(true)
      
      // Obter o token CSRF usando a função do auth.ts
      const { fetchCSRFToken } = await import('../../services/auth');
      const CSRFToken = await fetchCSRFToken();
      
      if (!CSRFToken) {
        throw new Error('Não foi possível obter o token CSRF');
      }
      
      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/rate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': CSRFToken
        },
        credentials: 'include',
        body: JSON.stringify({ rating: value })
      })

      if (response.ok) {
        setRating(value)
        setHasRated(true)
        setFeedback('Obrigado pela sua avaliação!')
        onRatingSubmit?.(value)
      } else {
        throw new Error('Falha ao enviar avaliação')
      }
    } catch (error) {
      console.error('Erro ao avaliar:', error)
      setFeedback('Não foi possível enviar sua avaliação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RatingContainer>
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarButton
            key={star}
            $filled={star <= (hoveredRating || rating)}
            onClick={() => handleRating(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly || isSubmitting}
            aria-label={`Avaliar com ${star} estrelas`}
          >
            <FaStar />
          </StarButton>
        ))}
      </StarsContainer>

      {hasRated && (
        <RatingInfo>
          Sua avaliação: {rating} estrela{rating !== 1 ? 's' : ''}
        </RatingInfo>
      )}

      {feedback && (
        <RatingFeedback $isPositive={feedback.includes('Obrigado')}>
          {feedback}
        </RatingFeedback>
      )}
    </RatingContainer>
  )
}