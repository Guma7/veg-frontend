// Definir a URL da API com fallback para o ambiente de desenvolvimento
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-api.onrender.com';

// Função para obter o token CSRF do cookie
export const getCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
};

// Função para fazer requisições à API
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  // Configurar headers padrão
  const headers = new Headers(options.headers || {});
  
  // Adicionar Content-Type se não for FormData
  if (!options.body || !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Adicionar token CSRF para métodos que modificam dados
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || '')) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
  }
  
  // Configurar a requisição
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Incluir cookies nas requisições
  };
  
  try {
    const response = await fetch(url, config);
    
    // Verificar se a resposta é bem-sucedida
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || 'Erro na requisição',
      }));
      
      throw {
        status: response.status,
        ...errorData,
      };
    }
    
    // Verificar se a resposta tem conteúdo
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// Objeto com funções de autenticação
export const apiAuth = {
  login: async (credentials: { email: string; password: string }) => {
    return fetchApi('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  register: async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    password_confirmation: string;
  }) => {
    return fetchApi('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: async () => {
    return fetchApi('/api/auth/logout/', {
      method: 'POST',
    });
  },
  
  // Adicionar outras funções conforme necessário
};