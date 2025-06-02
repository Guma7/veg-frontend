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
    console.log(`CSRF Token: ${csrfToken || 'Não encontrado'}`);
    
    // Preparar headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    
    // Adicionar o token CSRF ao header para todas as requisições POST, PUT, PATCH e DELETE
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      headers['X-CSRFToken'] = csrfToken;
      console.log('Adicionando token CSRF ao header');
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
    
    console.log(`Fazendo requisição para: ${fullUrl}`);
    console.log('API_URL configurada:', API_URL);
    console.log('Opções da requisição:', JSON.stringify(fetchOptions, null, 2));
    
    const response = await fetch(fullUrl, fetchOptions);
    console.log(`Resposta recebida: Status ${response.status} ${response.statusText}`);
    
    // Log dos headers da resposta
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('Headers da resposta:', responseHeaders);
    
    if (!response.ok) {
      console.error(`Erro na requisição: ${response.status} ${response.statusText}`);
      const error: ApiError = new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      error.status = response.status;
      try {
        error.data = await response.json();
        console.error('Detalhes do erro:', error.data);
      } catch (e) {
        error.data = {};
        console.error('Não foi possível obter detalhes do erro');
      }
      throw error;
    }
    
    const data = await response.json();
    console.log('Resposta recebida:', data);
    return data;
  } catch (error) {
    console.error('Erro ao fazer requisição:', error);
    // Adicionar mais detalhes sobre o erro
    if (error instanceof Error) {
      console.error('Mensagem de erro:', error.message);
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

// Login, registro e logout simplificados, sem token
export const apiAuth = {
  login: async (username: string, password: string) => {
    try {
      console.log('Tentando fazer login para:', username);
      console.log('URL da API para login:', `${API_URL}/api/auth/login/`);
      const response = await fetchApi('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response && response.user) {
        console.log('Login bem-sucedido:', response.user);
        return response.user;
      }
      throw new Error('Falha ao fazer login.');
    } catch (error) {
      console.error('Erro durante o login:', error);
      throw error;
    }
  },
  register: async (data: { username: string, email: string, password: string }) => {
    try {
      console.log('Tentando registrar usuário:', data.username);
      console.log('URL da API para registro:', `${API_URL}/api/auth/register/`);
      const response = await fetchApi('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response && response.user) {
        console.log('Registro bem-sucedido:', response.user);
        return response.user;
      }
      throw new Error('Falha ao registrar.');
    } catch (error) {
      console.error('Erro durante o registro:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      console.log('Tentando fazer logout');
      console.log('URL da API para logout:', `${API_URL}/api/auth/logout/`);
      return await fetchApi('/api/auth/logout/', { method: 'POST' });
    } catch (error) {
      console.error('Erro durante o logout:', error);
      throw error;
    }
  }
}