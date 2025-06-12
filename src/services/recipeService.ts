import { Recipe } from '../types/recipe'
import { fetchCSRFToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com'

export async function createRecipe(recipeData: Partial<Recipe>) {
  // Obter o token CSRF usando a função do auth.ts
  const CSRFToken = await fetchCSRFToken();
  console.log('Token CSRF para criar receita:', CSRFToken);
  
  if (!CSRFToken) {
    throw new Error('Não foi possível obter o token CSRF');
  }

  const response = await fetch(`${API_URL}/api/recipes/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Csrftoken': CSRFToken
    },
    body: JSON.stringify(recipeData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao criar receita')
  }

  return response.json()
}

export async function updateRecipe(slug: string, recipeData: Partial<Recipe>) {
  // Obter o token CSRF usando a função do auth.ts
  const CSRFToken = await fetchCSRFToken();
  console.log('Token CSRF para atualizar receita:', CSRFToken);
  
  if (!CSRFToken) {
    throw new Error('Não foi possível obter o token CSRF');
  }

  const response = await fetch(`${API_URL}/api/recipes/${slug}/`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Csrftoken': CSRFToken
    },
    body: JSON.stringify(recipeData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao atualizar receita')
  }

  return response.json()
}

export async function uploadRecipeImage(recipeId: string, imageFile: File) {
  // Obter o token CSRF usando a função do auth.ts
  const CSRFToken = await fetchCSRFToken();
  console.log('Token CSRF para upload de imagem:', CSRFToken);
  
  if (!CSRFToken) {
    throw new Error('Não foi possível obter o token CSRF');
  }

  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await fetch(`${API_URL}/api/recipes/${recipeId}/image/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Csrftoken': CSRFToken
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao fazer upload da imagem')
  }

  return response.json()
}

export async function getRecipeBySlug(slug: string) {
  // Garantir que estamos usando o endpoint correto para buscar por slug
  // Não exigimos autenticação para visualizar receitas
  const response = await fetch(`${API_URL}/api/recipes/by-slug/${slug}/`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao buscar receita' }))
    throw new Error(error.message || 'Erro ao buscar receita')
  }

  return response.json()
}

export async function deleteRecipe(slug: string) {
  try {
    // Importar a função fetchApi para usar o serviço centralizado que já inclui o token CSRF
    const { fetchApi } = await import('./api');
    
    // Usar o fetchApi que já gerencia os headers e o token CSRF automaticamente
    await fetchApi(`/api/recipes/${slug}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return true;
  } catch (error: any) {
    // Capturar e repassar o erro com uma mensagem mais descritiva
    console.error('Erro na requisição de exclusão:', error);
    throw new Error(error.data?.message || error.message || 'Erro ao excluir receita');
  }
}