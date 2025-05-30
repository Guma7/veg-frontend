'use client'
import styled from 'styled-components'
import { Card } from '../ui/Card'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatOption } from '../../utils/formatters'

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
`

const RecipeCard = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`

const RecipeImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const RecipeTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  margin: ${props => props.theme.spacing.sm} 0;
`

const RecipeInfo = styled.div`
  padding: ${props => props.theme.spacing.md};
`

const FilterBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
`

const FilterButton = styled.button<{ active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text.inverse : props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.text.inverse};
  }
`

interface Recipe {
  id: number;
  name: string;
  image: string;
  recipe_class: string;
  style: string;
  genre: string;
  nutritional_level?: string;
  does_not_contain?: string;
  traditional?: string;
  average_rating: number;
}

interface UserRecipesProps {
  userId: number;
}

export default function UserRecipes({ userId }: UserRecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filter, setFilter] = useState('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchUserRecipes()
    fetchCategories()
  }, [userId])

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/recipes/?author=${userId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/recipes/categories/`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(['all', ...data])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const filteredRecipes = recipes.filter(recipe => {
    if (filter === 'all') return true
    return recipe.recipe_class === filter || 
           recipe.style === filter || 
           recipe.genre === filter
  })

  return (
    <div>
      <FilterBar>
        {categories.map(category => (
          <FilterButton
            key={category}
            active={filter === category}
            onClick={() => setFilter(category)}
          >
            {category === 'all' ? 'Todas' : formatOption(category)}
          </FilterButton>
        ))}
      </FilterBar>

      <RecipeGrid>
        {filteredRecipes.map(recipe => (
          <Link href={`/receitas/${recipe.id}`} key={recipe.id}>
            <RecipeCard>
              <RecipeImage>
                <Image
                  src={recipe.image ? (recipe.image.startsWith('http') ? recipe.image : recipe.image.startsWith('/') ? `http://localhost:8000${recipe.image}` : `http://localhost:8000/${recipe.image}`) : '/default-recipe.jpg'}
                  alt={recipe.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </RecipeImage>
              <RecipeInfo>
                <RecipeTitle>{recipe.name}</RecipeTitle>
                <div>Avaliação: {recipe.average_rating.toFixed(1)}</div>
              </RecipeInfo>
            </RecipeCard>
          </Link>
        ))}
      </RecipeGrid>
    </div>
  )
}