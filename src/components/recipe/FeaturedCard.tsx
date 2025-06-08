'use client'

import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar, FaClock, FaUtensils } from 'react-icons/fa'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const Card = styled.div`
  position: relative;
  height: 400px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
`

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
`

const Content = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${props => props.theme.spacing.xl};
  color: white;
`

const Title = styled.h2`
  font-size: ${props => props.theme.fonts.sizes['2xl']};
  margin-bottom: ${props => props.theme.spacing.md};
`

const MetaInfo = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  font-size: ${props => props.theme.fonts.sizes.sm};
`

interface FeaturedCardProps {
  recipe: {
    id: number;
    title: string;
    image: string;
    rating?: number;
    prepTime: string;
    servings: number;
  }
}

export function FeaturedCard({ recipe }: FeaturedCardProps) {
  return (
    <Link href={`/receitas/${recipe.id}`} style={{ textDecoration: 'none' }}>
      <Card>
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
        <ImageOverlay />
        <Content>
          <Title>{recipe.title}</Title>
          <MetaInfo>
            <span><FaStar /> {recipe.rating !== undefined ? recipe.rating.toFixed(1) : '0.0'}</span>
            <span><FaClock /> {recipe.prepTime}</span>
            <span><FaUtensils /> {recipe.servings} porções</span>
          </MetaInfo>
        </Content>
      </Card>
    </Link>
  )
}