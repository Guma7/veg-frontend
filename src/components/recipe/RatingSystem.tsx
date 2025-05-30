'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const Stars = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`

const Star = styled(FaStar)<{ active: boolean }>`
  cursor: pointer;
  color: ${props => props.active ? props.theme.colors.secondary : props.theme.colors.border};
  font-size: 1.5rem;
  transition: color 0.2s;
`

interface RatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export function RatingSystem({ value, onChange }: RatingProps) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <RatingContainer>
      <Stars>
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            active={hover !== null ? hover >= i + 1 : value >= i + 1}
            onClick={() => onChange(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </Stars>
      <span>{hover || value || 0}/10</span>
    </RatingContainer>
  )
}