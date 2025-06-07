import { getCsrfToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com'

export interface RecipeData {
  title: string
  recipe_class: string
  style: string
  genre: string
  ingredients: string
  instructions: string
  image?: File
  nutritional_level?: string
  does_not_contain?: string
  traditional?: string
  youtube_link?: string
}

export const createRecipe = async (recipeData: FormData) => {
  try {
    console.log('Obtendo token CSRF antes de criar receita...')
    const csrfToken = await getCsrfToken()
    console.log('Token CSRF obtido:', csrfToken)
    
    const headers = new Headers()
    headers.append('X-CSRFToken', csrfToken)
    // Não definimos Content-Type para FormData, o navegador define automaticamente com boundary
    
    console.log('Enviando requisição para criar receita com token CSRF...')
    const response = await fetch(`${API_URL}/api/recipes/`, {
      method: 'POST',
      headers: headers,
      body: recipeData,
      credentials: 'include'
    })
    
    if (!response.ok) {
      console.error('Erro ao criar receita. Status:', response.status)
      const errorData = await response.json().catch(() => null)
      console.error('Detalhes do erro:', errorData)
      
      // Criar um erro com detalhes para ser capturado pelo componente
      const error = new Error('Erro ao criar receita')
      // @ts-ignore
      error.response = response
      throw error
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao criar receita:', error)
    throw error
  }
}

export const updateRecipe = async (recipeId: string, recipeData: FormData) => {
  try {
    console.log('Obtendo token CSRF antes de atualizar receita...')
    const csrfToken = await getCsrfToken()
    console.log('Token CSRF obtido:', csrfToken)
    
    const headers = new Headers()
    headers.append('X-CSRFToken', csrfToken)
    // Não definimos Content-Type para FormData, o navegador define automaticamente com boundary
    
    const response = await fetch(`${API_URL}/api/recipes/${recipeId}/`, {
      method: 'PUT',
      headers: headers,
      body: recipeData,
      credentials: 'include'
    })
    
    if (!response.ok) {
      console.error('Erro ao atualizar receita. Status:', response.status)
      const errorData = await response.json().catch(() => null)
      console.error('Detalhes do erro:', errorData)
      
      // Criar um erro com detalhes para ser capturado pelo componente
      const error = new Error('Erro ao atualizar receita')
      // @ts-ignore
      error.response = response
      throw error
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao atualizar receita:', error)
    throw error
  }
}

export const uploadRecipeImage = async (recipeId: string, imageFile: File) => {
  try {
    console.log('Obtendo token CSRF antes de fazer upload de imagem...')
    const csrfToken = await getCsrfToken()
    console.log('Token CSRF obtido:', csrfToken)
    
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const headers = new Headers()
    headers.append('X-CSRFToken', csrfToken)
    // Não definimos Content-Type para FormData, o navegador define automaticamente com boundary
    
    const response = await fetch(`${API_URL}/api/recipes/${recipeId}/upload_image/`, {
      method: 'POST',
      headers: headers,
      body: formData,
      credentials: 'include'
    })
    
    if (!response.ok) {
      console.error('Erro ao fazer upload de imagem. Status:', response.status)
      const errorData = await response.json().catch(() => null)
      console.error('Detalhes do erro:', errorData)
      
      // Criar um erro com detalhes para ser capturado pelo componente
      const error = new Error('Erro ao fazer upload de imagem')
      // @ts-ignore
      error.response = response
      throw error
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error)
    throw error
  }
}