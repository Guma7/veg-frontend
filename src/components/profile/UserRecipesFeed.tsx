'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { RecipeCard } from '../recipe/RecipeCard'

interface Recipe {
  id: string
  title: string
  slug: string
  image: string
  image_url?: string
  averageRating?: number
  rating?: number
}

const FeedContainer = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const RecipesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`

export default function UserRecipesFeed({ userId }: { userId: string }) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchUserRecipes()
  }, [userId, filter])

  const fetchUserRecipes = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:8000/api/recipes/user/${userId}/?category=${filter}`,
        { credentials: 'include' }
      )
      if (response.ok) {
        const data = await response.json()
        setRecipes(data.results)
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FeedContainer>
      <FeedHeader>
        <h2>Minhas Receitas</h2>
        <FilterSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="published">Publicadas</option>
          <option value="draft">Rascunhos</option>
        </FilterSelect>
      </FeedHeader>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <RecipesGrid>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={{
              id: recipe.id,
              title: recipe.title,
              slug: recipe.slug,
              image: recipe.image_url || recipe.image || '/default-recipe.jpg',
              rating: recipe.rating || recipe.averageRating || 0
            }} />
          ))}
        </RecipesGrid>
      )}
    </FeedContainer>
  )
}