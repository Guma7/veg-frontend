'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { RecipeCard } from '../recipe/RecipeCard'

// Definição da variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-api.onrender.com';

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl};
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Title = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.xl};
`

const ViewAll = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.fonts.weights.medium};
  
  &:hover {
    text-decoration: underline;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

interface Recipe {
  id: string
  title: string
  slug: string
  image: string
  image_url?: string
  rating: number
  totalRatings: number
  isFavorite: boolean
}

export function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedRecipes()
  }, [])

  const fetchFeaturedRecipes = async () => {
    try {
      // Usando a variável API_URL já definida no início do arquivo
      const response = await fetch(`${API_URL}/api/recipes/featured/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Erro ao carregar receitas em destaque:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <Section>
      <SectionHeader>
        <Title>Receitas em Destaque</Title>
        <ViewAll href="/receitas">Ver todas</ViewAll>
      </SectionHeader>
      
      <Grid>
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={{
            id: recipe.id,
            title: recipe.title,
            slug: recipe.slug,
            image: recipe.image_url || recipe.image,
            rating: recipe.rating
          }} />
        ))}
      </Grid>
    </Section>
  )
}