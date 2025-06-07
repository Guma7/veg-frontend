'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { useAuth } from '../../../contexts/AuthContextFront'
import { RecipeForm } from '../../../components/recipe/RecipeForm'
import { createRecipe } from '../../../services/recipeService'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.primary};
`

export default function NewRecipePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    if (!user) return

    setLoading(true)
    setError('')

    try {
      console.log('Iniciando criação de receita usando o serviço atualizado...')
      
      // Usar o serviço de criação de receita que já inclui a lógica de CSRF
      const response = await createRecipe(formData)
      
      console.log('Receita criada com sucesso:', response)
      
      // Redirecionar para a página da receita
      if (response && response.slug) {
        router.push(`/receitas/${response.slug}`)
      } else {
        router.push('/receitas')
      }
    } catch (error: any) {
      console.error('Erro completo ao criar receita:', error)
      
      // Se o erro tiver uma resposta, propaga para o componente RecipeForm tratar
      if (error.response) {
        throw error // Propaga o erro com os detalhes da resposta
      } else {
        setError('Erro ao criar receita. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Title>Nova Receita</Title>
      <RecipeForm 
        onSubmit={handleSubmit} 
        initialData={{}}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  )
}