'use client'

import { useState, useEffect } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { useAuth } from '../../../../contexts/AuthContextFront'
import { RecipeForm } from '../../../../components/recipe/RecipeForm'
import { getRecipeBySlug, updateRecipe } from '../../../../services/recipeService'

// Definição da variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text.primary};
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
`

const ErrorMessage = styled.div`
  color: red;
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: #ffeeee;
  border-radius: ${props => props.theme.borderRadius.md};
`

// Definição simples dos parâmetros
type PageProps = {
  params: {
    slug: string
  }
}

export default function EditRecipePage({ params }: PageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [recipe, setRecipe] = useState<any>(null)
  const [error, setError] = useState('')

  // Acessar params.slug diretamente
  const recipeSlug = params.slug

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchRecipe = async () => {
      try {
        const recipeData = await getRecipeBySlug(recipeSlug)
        setRecipe(recipeData)
      } catch (error) {
        console.error('Erro ao carregar receita:', error)
        setError('Não foi possível carregar a receita. Verifique se você tem permissão para editá-la.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [user, router, recipeSlug])

  const handleSubmit = async (formData: any) => {
    if (!user || !recipe) return

    setSubmitting(true)
    setError('')

    try {
      // Obter o token CSRF antes de fazer a requisição
      await fetch(`${API_URL}/api/auth/csrf/`, {
        method: 'GET',
        credentials: 'include'
      })
      
      // Obter o token CSRF do cookie
      const getCsrfToken = (): string => {
        const cookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          
        if (cookie) {
          return cookie.split('=')[1]
        }
        
        return ''
      }
      
      const csrfToken = getCsrfToken()
      
      // Log do FormData para depuração
      console.log('Enviando dados para o servidor:')
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `Arquivo: ${pair[1].name} (${pair[1].size} bytes)` : pair[1]))
      }
      
      const response = await fetch(`${API_URL}/api/recipes/${recipeSlug}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken
        },
        body: formData
      })

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json()
          console.error('Erro ao atualizar receita:', errorData)
        } catch (jsonError) {
          console.error('Erro ao processar resposta JSON:', jsonError)
          errorData = { status: response.status, message: 'Erro ao processar resposta do servidor' }
        }
        
        const errorObj: any = new Error(errorData?.detail || 'Erro ao atualizar receita')
        errorObj.response = {
          status: response.status,
          data: errorData,
          json: async () => errorData
        }
        throw errorObj
      }

      const data = await response.json()
      router.push(`/receitas/${data.slug}`)
    } catch (error: any) {
      console.error('Erro completo:', error)
      
      if (error.response) {
        throw error
      } else {
        setError('Erro ao atualizar receita. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Carregando receita...</LoadingMessage>
      </Container>
    )
  }

  if (!recipe) {
    return (
      <Container>
        <ErrorMessage>Receita não encontrada ou você não tem permissão para editá-la.</ErrorMessage>
      </Container>
    )
  }

  return (
    <Container>
      <Title>Editar Receita</Title>
      <RecipeForm 
        onSubmit={handleSubmit} 
        initialData={recipe}
        isEditing={true}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  )
}