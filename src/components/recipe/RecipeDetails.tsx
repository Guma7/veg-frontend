'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { RatingSystem } from './RatingSystem'
import { YouTubePreview } from './YouTubePreview'
import { formatOption } from '../../utils/formatters'

const RecipeContainer = styled.article`
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const RecipeHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const RecipeContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
`

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`

interface Recipe {
  id: string;
  title: string;
  image: string;
  rating: number;
  ingredients: string;
  instructions: string;
  youtubeUrl?: string;
  youtube_link?: string;
  recipe_class: string;
  style: string;
  genre: string;
  nutritional_level?: string;
  does_not_contain?: string;
  traditional?: string;
}

interface RecipeDetailsProps {
  recipe: Recipe;
}

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  return (
    <RecipeContainer>
      <ImageContainer>
        <Image
            src={recipe.image ? (recipe.image.startsWith('http') ? recipe.image : recipe.image.startsWith('/') ? `http://localhost:8000${recipe.image}` : `http://localhost:8000/${recipe.image}`) : '/default-recipe.jpg'}
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
          />
      </ImageContainer>
      
      <RecipeHeader>
        <h1>{recipe.title}</h1>
        <RatingSystem value={recipe.rating} onChange={() => {}} />
      </RecipeHeader>

      <RecipeContent>
        <div>
          <Section>
            <h2>Ingredientes</h2>
            <div>
              {typeof recipe.ingredients === 'string' && 
              <div dangerouslySetInnerHTML={{ __html: recipe.ingredients }} />
            }
            </div>
          </Section>
          
          <Section>
            <h2>Modo de Preparo</h2>
            <div>
              {typeof recipe.instructions === 'string' && 
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            }
            </div>
          </Section>

          {(recipe.youtubeUrl || recipe.youtube_link) && (
            <Section>
              <h2>Vídeo</h2>
              <YouTubePreview value={recipe.youtubeUrl || recipe.youtube_link || ''} onChange={() => {}} />
            </Section>
          )}
        </div>

        <aside>
          <Section>
            <h3>Informações</h3>
            <p>Classe: {formatOption(recipe.recipe_class)}</p>
            <p>Estilo: {formatOption(recipe.style)}</p>
            <p>Gênero: {formatOption(recipe.genre)}</p>
            {recipe.nutritional_level && <p>Nível Nutricional: {formatOption(recipe.nutritional_level)}</p>}
            {recipe.does_not_contain && <p>Não Contém: {formatOption(recipe.does_not_contain)}</p>}
            {recipe.traditional && <p>Tradicional: {formatOption(recipe.traditional)}</p>}
          </Section>

        </aside>
      </RecipeContent>
    </RecipeContainer>
  )
}