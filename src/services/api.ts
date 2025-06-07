import { getCsrfToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com'

// Função para fazer requisições à API com tratamento de CSRF
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${API_URL}${endpoint}`
    const method = options.method || 'GET'
    
    // Configurar headers padrão
    const headers = new Headers(options.headers || {})
    
    // Adicionar headers padrão se não foram especificados
    if (!headers.has('Accept')) {
      headers.append('Accept', 'application/json')
    }
    
    // Para métodos que modificam dados, obter e adicionar o token CSRF
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      console.log(`Obtendo token CSRF para requisição ${method} ${endpoint}...`)
      const csrfToken = await getCsrfToken()
      
      if (!csrfToken) {
        console.error('Token CSRF não encontrado. A requisição pode falhar.')
      } else {
        console.log(`Token CSRF obtido (${csrfToken.length} caracteres): ${csrfToken}`)
        headers.set('X-CSRFToken', csrfToken)
      }
      
      // Se não for FormData, definir Content-Type como application/json
      if (!options.body || !(options.body instanceof FormData)) {
        if (!headers.has('Content-Type')) {
          headers.append('Content-Type', 'application/json')
        }
      }
    }
    
    // Configurar a requisição com credentials: 'include' para enviar cookies
    const requestOptions: RequestInit = {
      ...options,
      method,
      headers,
      credentials: 'include',
    }
    
    console.log(`Enviando requisição ${method} para ${url}`, {
      headers: Object.fromEntries(headers.entries()),
      bodyType: options.body ? (options.body instanceof FormData ? 'FormData' : typeof options.body) : 'none'
    })
    
    const response = await fetch(url, requestOptions)
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      console.error(`Erro na requisição ${method} ${url}. Status: ${response.status}`)
      
      // Tentar obter detalhes do erro
      let errorData
      try {
        errorData = await response.json()
        console.error('Detalhes do erro:', errorData)
      } catch (e) {
        console.error('Não foi possível obter detalhes do erro:', e)
      }
      
      // Criar um erro com detalhes para ser capturado pelo componente
      const error = new Error(`Erro na requisição ${method} ${url}`)
      // @ts-ignore
      error.status = response.status
      // @ts-ignore
      error.data = errorData
      // @ts-ignore
      error.response = response
      throw error
    }
    
    // Para respostas vazias (como DELETE bem-sucedido)
    if (response.status === 204) {
      return null
    }
    
    // Para outras respostas, retornar o JSON
    return await response.json()
  } catch (error) {
    console.error('Erro na requisição à API:', error)
    throw error
  }
}

// Funções específicas para autenticação
export const authApi = {
  login: async (username: string, password: string) => {
    return fetchApi('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
  
  register: async (userData: any) => {
    return fetchApi('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },
  
  logout: async () => {
    return fetchApi('/api/auth/logout/', {
      method: 'POST',
    })
  },
  
  getUser: async () => {
    return fetchApi('/api/auth/user/')
  },
}