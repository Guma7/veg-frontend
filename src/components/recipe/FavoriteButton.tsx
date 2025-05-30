'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

const Button = styled.button<{ $isFavorite: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$isFavorite ? props.theme.colors.error : props.theme.colors.text.secondary};
  font-size: 1.5rem;
  padding: ${props => props.theme.spacing.sm};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`

interface FavoriteButtonProps {
  recipeId: number;
  initialFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({ recipeId, initialFavorite = false, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  const handleToggle = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/favorite`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
        onToggle?.(!isFavorite)
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error)
    }
  }

  return (
    <Button
      $isFavorite={isFavorite}
      onClick={handleToggle}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      {isFavorite ? <FaHeart /> : <FaRegHeart />}
    </Button>
  )
}