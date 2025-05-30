'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { Star, StarHalf, StarFill } from '@phosphor-icons/react'

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`

const StarContainer = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${props => props.theme.colors.warning};
  font-size: 24px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

const RatingText = styled.span`
  margin-left: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.sm};
`

interface RatingProps {
  initialValue?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  showValue?: boolean
  maxValue?: number
}

export function Rating({
  initialValue = 0,
  onChange,
  readOnly = false,
  showValue = true,
  maxValue = 10
}: RatingProps) {
  const [rating, setRating] = useState(initialValue)
  const [hover, setHover] = useState(0)

  const handleRating = (value: number) => {
    if (!readOnly) {
      setRating(value)
      onChange?.(value)
    }
  }

  const renderStar = (index: number) => {
    const value = hover || rating
    const starValue = (index + 1) * 2

    if (starValue <= value) {
      return <StarFill weight="fill" />
    } else if (starValue - 1 <= value) {
      return <StarHalf weight="fill" />
    }
    return <Star />
  }

  return (
    <RatingContainer>
      {Array.from({ length: maxValue / 2 }, (_, index) => (
        <StarContainer
          key={index}
          onClick={() => handleRating((index + 1) * 2)}
          onMouseEnter={() => !readOnly && setHover((index + 1) * 2)}
          onMouseLeave={() => !readOnly && setHover(0)}
          disabled={readOnly}
          type="button"
          aria-label={`Rate ${(index + 1) * 2} out of ${maxValue}`}
        >
          {renderStar(index)}
        </StarContainer>
      ))}
      {showValue && <RatingText>{rating.toFixed(1)}</RatingText>}
    </RatingContainer>
  )
}