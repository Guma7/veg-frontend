'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

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
      // Obter o token CSRF usando a função do auth.ts
      const { fetchCSRFToken } = await import('../../services/auth');
      const CSRFToken = await fetchCSRFToken();
      
      if (!CSRFToken) {
        console.error('Não foi possível obter o token CSRF');
        return;
      }

      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/favorite/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': CSRFToken
        }
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