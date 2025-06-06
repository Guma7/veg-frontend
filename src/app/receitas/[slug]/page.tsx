'use client'

import { useState, useEffect } from 'react'
import * as React from 'react'
import styled from 'styled-components'
import { useAuth } from '../../../contexts/AuthContextFront'
import { RatingStars } from '../../../components/recipe/RatingStars'
import { ShareRecipe } from '../../../components/recipe/ShareRecipe'
import { Comments } from '../../../components/recipe/Comments'
import { getRecipeBySlug, deleteRecipe } from '../../../services/recipeService'
import { formatOption } from '../../../utils/formatters'
import YouTubePlayer from '../../../components/recipes/YouTubePlayer'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const RecipeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const RecipeImage = styled.div`
  width: 100%;
  max-width: 600px;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin: 0 auto ${props => props.theme.spacing.xl} auto;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const RecipeHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const RecipeDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
`

const DetailItem = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
  
  h4 {
    font-weight: ${props => props.theme.fonts.weights.bold};
    margin-bottom: ${props => props.theme.spacing.xs};
    color: ${props => props.theme.colors.text.primary};
  }
  
  p {
    color: ${props => props.theme.colors.text.secondary};
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`

const DeleteButton = styled(ActionButton)`
  background: #e74c3c;
  
  &:hover {
    background: #c0392b;
  }
`

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`

const IngredientsList = styled.div`
  padding: 0;
  
  ul, ol {
    padding-left: ${props => props.theme.spacing.lg};
  }
  
  li {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`

const IngredientItem = styled.div`
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const Instructions = styled.div`
  line-height: 1.6;
  
  ul, ol {
    padding-left: ${props => props.theme.spacing.lg};
  }
  
  li {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`

interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
}

interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  image: string
  image_url?: string
  ingredients: string | Ingredient[]
  instructions: string
  recipe_class?: string
  genre?: string
  style?: string
  nutritional_level?: string
  does_not_contain?: string
  traditional?: string
  youtube_link?: string
  youtubeUrl?: string
  author: {
    id: string
    username: string
    profileImage: string
  }
  createdAt: string
  averageRating: number
  totalRatings: number
  userRating?: number
  socialLinks?: {
    facebook?: string
    twitter?: string
    whatsapp?: string
  }
}

// Definição simples dos parâmetros
type PageProps = {
  params: {
    slug: string
  }
}

export default function RecipePage({ params }: PageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  
  // Acessar params.slug diretamente
  const recipeSlug = params.slug

  useEffect(() => {
    if (recipeSlug) {
      fetchRecipe()
    }
  }, [recipeSlug]);
  
  // Garantir que a página seja acessível mesmo sem autenticação

  const fetchRecipe = async () => {
    try {
      console.log('Buscando receita pelo slug:', recipeSlug)
      // Buscar a receita pelo slug
      const recipeData = await getRecipeBySlug(recipeSlug)
      
      if (recipeData) {
        console.log('Receita encontrada:', recipeData)
        setRecipe({
          ...recipeData,
          averageRating: recipeData.average_rating || 0,
          totalRatings: recipeData.total_ratings || 0,
          createdAt: recipeData.created_at || new Date().toISOString(),
        })
      } else {
        setError('Receita não encontrada')
      }
    } catch (error) {
      console.error('Erro ao buscar receita:', error)
      setError('Erro ao carregar a receita. Por favor, tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleEditRecipe = () => {
    router.push(`/receitas/editar/${recipeSlug}`)
  }
  
  const handleDeleteRecipe = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')) {
      try {
        await deleteRecipe(recipeSlug)
        alert('Receita excluída com sucesso!')
        router.push('/receitas')
      } catch (error) {
        console.error('Erro ao excluir receita:', error)
        alert('Erro ao excluir receita. Tente novamente.')
      }
    }
  }

  if (loading) {
    return (
      <RecipeContainer>
        <div>Carregando receita...</div>
      </RecipeContainer>
    )
  }

  if (error) {
    return (
      <RecipeContainer>
        <div>Erro: {error}</div>
      </RecipeContainer>
    )
  }

  if (!recipe) {
    return (
      <RecipeContainer>
        <div>Receita não encontrada</div>
      </RecipeContainer>
    )
  }

  return (
    <RecipeContainer>
      <RecipeImage>
        <img 
          src={recipe.image_url ? recipe.image_url : recipe.image ? (recipe.image.startsWith('http') ? recipe.image : recipe.image.startsWith('/') ? `${API_URL}${recipe.image}` : `${API_URL}/${recipe.image}`) : '/default-recipe.jpg'} 
          alt={recipe.title} 
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = '/default-recipe.jpg'
          }}
        />
      </RecipeImage>
      
      <RecipeHeader>
        <Title>{recipe.title}</Title>
        
        <AuthorInfo>
          <a href="https://vegworld.onrender.com/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
            <div>
              <p>Por {recipe.author?.username || 'Autor desconhecido'}</p>
            </div>
          </a>
        </AuthorInfo>
        
        <div>
          <RatingStars 
            recipeId={recipe.id}
            initialRating={recipe.averageRating || 0}
            readonly={true}
          />
          <span>{recipe.totalRatings || 0} avaliações</span>
        </div>
        
        {user && recipe.author && user.id === recipe.author.id && (
          <ActionButtons>
            <ActionButton onClick={handleEditRecipe}>
              <FaEdit /> Editar Receita
            </ActionButton>
            <DeleteButton onClick={handleDeleteRecipe}>
              <FaTrash /> Excluir Receita
            </DeleteButton>
          </ActionButtons>
        )}
      </RecipeHeader>
      
      <RecipeDetails>
        {recipe.recipe_class && (
          <DetailItem>
            <h4>Classe</h4>
            <p>{formatOption(recipe.recipe_class)}</p>
          </DetailItem>
        )}
        
        {recipe.genre && (
          <DetailItem>
            <h4>Gênero</h4>
            <p>{formatOption(recipe.genre)}</p>
          </DetailItem>
        )}
        
        {recipe.style && (
          <DetailItem>
            <h4>Estilo</h4>
            <p>{formatOption(recipe.style)}</p>
          </DetailItem>
        )}
        
        {recipe.nutritional_level && (
          <DetailItem>
            <h4>Nível Nutricional</h4>
            <p>{formatOption(recipe.nutritional_level)}</p>
          </DetailItem>
        )}
        
        {recipe.does_not_contain && (
          <DetailItem>
            <h4>Não Contém</h4>
            <p>{formatOption(recipe.does_not_contain)}</p>
          </DetailItem>
        )}
        
        {recipe.traditional && (
          <DetailItem>
            <h4>Tradicional</h4>
            <p>{formatOption(recipe.traditional)}</p>
          </DetailItem>
        )}
      </RecipeDetails>
      
      <Section>
        <SectionTitle>Ingredientes</SectionTitle>
        <IngredientsList>
          {typeof recipe.ingredients === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: recipe.ingredients }} />
            ) : (
              recipe.ingredients.map((ingredient, index) => (
                <IngredientItem key={index}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </IngredientItem>
              ))
            )}
        </IngredientsList>
      </Section>
      
      <Section>
        <SectionTitle>Modo de Preparo</SectionTitle>
        <Instructions>
          {typeof recipe.instructions === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
          ) : (
            <p>Instruções não disponíveis</p>
          )}
        </Instructions>
      </Section>
      
      {(recipe.youtube_link || recipe.youtubeUrl) && (
        <Section>
          <SectionTitle>Vídeo</SectionTitle>
          <YouTubePlayer url={recipe.youtube_link || recipe.youtubeUrl || ''} />
        </Section>
      )}
      
      <ShareRecipe recipeId={recipe.id} recipeTitle={recipe.title} />
      
      <Comments recipeId={recipe.id} />
    </RecipeContainer>
  )
}