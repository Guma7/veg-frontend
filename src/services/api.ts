const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiError extends Error {
  status?: number
  data?: any
}

// Função utilitária para obter um cookie pelo nome
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
  return null;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    // Lista de endpoints públicos que não requerem autenticação
    const publicEndpoints = [
      '/login/',
      '/register/',
      '/recipes/search/',
      '/recipes/featured/',
      '/recipes/categories/',
      '/recipes/by-slug/',
      '/api/recipes/by-slug/'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(e => endpoint.includes(e));
    
    // Obter o token CSRF do cookie
    const csrfToken = getCookie('csrftoken');
    
    // Preparar headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    
    // Adicionar o token CSRF ao header para todas as requisições POST, PUT, PATCH e DELETE
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    // Sempre incluir credentials: 'include' para enviar cookies de sessão
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };
    
    // Garantir que a URL da API seja usada corretamente
    let fullUrl = endpoint;
    if (!endpoint.startsWith('http')) {
      // Se o endpoint não começar com http, adicionar a URL da API
      fullUrl = `${API_URL}${endpoint}`;
    }
    
    const response = await fetch(fullUrl, fetchOptions);
    if (!response.ok) {
      const error: ApiError = new Error('Erro na requisição');
      error.status = response.status;
      error.data = await response.json().catch(() => ({}));
      throw error;
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

// Login, registro e logout simplificados, sem token
export const apiAuth = {
  login: async (username: string, password: string) => {
    const response = await fetchApi('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (response && response.user) {
      return response.user;
    }
    throw new Error('Falha ao fazer login.');
  },
  register: async (data: { username: string, email: string, password: string }) => {
    const response = await fetchApi('/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response && response.user) {
      return response.user;
    }
    throw new Error('Falha ao registrar.');
  },
  logout: async () => {
    return fetchApi('/api/auth/logout/', { method: 'POST' });
  }
}