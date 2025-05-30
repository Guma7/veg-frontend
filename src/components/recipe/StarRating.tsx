'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const StarsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`

const StarButton = styled.button<{ filled: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.filled ? props.theme.colors.warning : '#999'};
  font-size: 24px;
  transition: transform 0.2s, color 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    transform: scale(1.1);
  }
`

const RatingText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
`

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.primary};

  svg {
    color: ${props => props.theme.colors.warning};
  }
`

interface StarRatingProps {
  initialRating?: number;
  totalRatings?: number;
  averageRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

export function StarRating({ 
  initialRating = 0, 
  totalRatings = 0,
  averageRating = 0,
  onRate,
  readonly = false 
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleRate = (value: number) => {
    if (readonly) return
    setRating(value)
    onRate?.(value)
  }

  return (
    <RatingContainer>
      {averageRating > 0 && (
        <AverageRating>
          <FaStar /> {averageRating.toFixed(1)}
          <RatingText>({totalRatings} avaliações)</RatingText>
        </AverageRating>
      )}
      
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarButton
            key={star}
            filled={star <= (hoveredRating || rating)}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly}
            aria-label={`Avaliar ${star} estrelas`}
          >
            <FaStar />
          </StarButton>
        ))}
      </StarsContainer>
      
      {!readonly && rating > 0 && (
        <RatingText>Sua avaliação: {rating} estrelas</RatingText>
      )}
    </RatingContainer>
  )
}