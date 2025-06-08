'use client'

import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const Card = styled.div`
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`

const Content = styled.div`
  padding: ${props => props.theme.spacing.md};
`

const Title = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fonts.sizes.lg};
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.secondary};
`

interface RecipeCardProps {
  recipe: {
    id: string | number
    title: string
    image: string
    slug?: string
    rating?: number
  }
  className?: string
  compact?: boolean
}

export function RecipeCard({ recipe, className, compact }: RecipeCardProps) {
  // Garantir que o slug seja usado corretamente para o link da receita
  const recipeLink = `/receitas/${recipe.slug || recipe.id}`;
  
  return (
    <Link href={recipeLink} style={{ textDecoration: 'none' }}>
      <Card className={className}>
        <ImageContainer>
          <Image
            src={recipe.image ? (recipe.image.startsWith('http') ? recipe.image : recipe.image.startsWith('/') ? `${API_URL}${recipe.image}` : `${API_URL}/${recipe.image}`) : '/default-recipe.png'}
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/default-recipe.png';
            }}
          />
        </ImageContainer>
        <Content>
          <Title>{recipe.title}</Title>
          <Rating>
            <FaStar /> {recipe.rating !== undefined ? recipe.rating.toFixed(1) : '0.0'}
          </Rating>
        </Content>
      </Card>
    </Link>
  )
}

export default RecipeCard