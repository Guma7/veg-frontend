'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { useAuth } from '../../../contexts/AuthContextFront'
import { RecipeForm } from '../../../components/recipe/RecipeForm'

// Definir a variável API_URL
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

export default function NewRecipePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: any) => {
    if (!user) return

    setLoading(true)
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
      
      const response = await fetch(`${API_URL}/api/recipes/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken
        },
        // Não definir Content-Type ao usar FormData, o navegador configurará automaticamente
        // incluindo o boundary necessário para multipart/form-data
        body: formData
      })
      
      // Log da resposta para depuração
      console.log('Resposta do servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers])
      })

      if (!response.ok) {
        let errorData;
        try {
          // Tenta obter o corpo da resposta como JSON
          errorData = await response.json()
          console.error('Erro ao criar receita:', errorData)
        } catch (jsonError) {
          console.error('Erro ao processar resposta JSON:', jsonError)
          // Se não conseguir processar como JSON, cria um objeto de erro com o status
          errorData = { status: response.status, message: 'Erro ao processar resposta do servidor' }
        }
        
        // Cria um objeto de erro personalizado com mais informações
        const errorObj: any = new Error(errorData?.detail || 'Erro ao criar receita')
        errorObj.response = {
          status: response.status,
          data: errorData,
          json: async () => errorData
        }
        throw errorObj
      }

      const data = await response.json()
      router.push(`/receitas/${data.slug}`)
      // Redirecionando para o slug em vez do ID para corresponder à rota correta
    } catch (error: any) {
      console.error('Erro completo:', error)
      
      // Passa o erro completo para o componente RecipeForm para tratamento detalhado
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