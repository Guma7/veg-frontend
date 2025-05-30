'use client'

import styled from 'styled-components'
import { FaEye, FaStar, FaHeart, FaComment } from 'react-icons/fa'

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.hover};
  border-radius: ${props => props.theme.borderRadius.md};
`

const StatIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
`

const StatValue = styled.div`
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary};
`

const StatLabel = styled.div`
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`

interface RecipeStatsProps {
  views: number;
  rating: number;
  favorites: number;
  comments: number;
}

export function RecipeStats({ views, rating, favorites, comments }: RecipeStatsProps) {
  return (
    <StatsContainer>
      <StatCard>
        <StatIcon><FaEye /></StatIcon>
        <StatValue>{views.toLocaleString()}</StatValue>
        <StatLabel>Visualizações</StatLabel>
      </StatCard>

      <StatCard>
        <StatIcon><FaStar /></StatIcon>
        <StatValue>{rating.toFixed(1)}</StatValue>
        <StatLabel>Avaliação Média</StatLabel>
      </StatCard>

      <StatCard>
        <StatIcon><FaHeart /></StatIcon>
        <StatValue>{favorites.toLocaleString()}</StatValue>
        <StatLabel>Favoritos</StatLabel>
      </StatCard>

      <StatCard>
        <StatIcon><FaComment /></StatIcon>
        <StatValue>{comments.toLocaleString()}</StatValue>
        <StatLabel>Comentários</StatLabel>
      </StatCard>
    </StatsContainer>
  )
}