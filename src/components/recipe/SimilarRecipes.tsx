import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Recipe } from '../../types/recipe'
import RecipeCard from './RecipeCard'
import { LoadingState } from '../common/FeedbackStates'

const Container = styled.div`
  margin-top: 3rem;
`

const Title = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 1.5rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`

interface Props {
  recipeId: number
}

export default function SimilarRecipes({ recipeId }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/recipes/${recipeId}/similar/`
        )
        if (response.ok) {
          const data = await response.json()
          setRecipes(data)
        }
      } catch (error) {
        console.error('Erro ao buscar receitas similares:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarRecipes()
  }, [recipeId])

  if (loading) return <LoadingState />
  if (recipes.length === 0) return null

  return (
    <Container>
      <Title>Receitas Similares</Title>
      <Grid>
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} compact />
        ))}
      </Grid>
    </Container>
  )
}