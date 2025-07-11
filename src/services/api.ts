// Definir a URL da API com fallback para o ambiente de desenvolvimento
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

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
    // Importar e usar a função fetchCsrfToken do auth.ts
    const { fetchCSRFToken } = await import('./auth');
    let CSRFToken = await fetchCSRFToken();
    
    if (CSRFToken) {
      // Verificar e corrigir o comprimento do token
      if (CSRFToken.length !== 64) {
        console.warn('Token CSRF com comprimento incorreto em fetchApi:', CSRFToken.length, 'esperado: 64');
        
        // Ajustar o comprimento do token para 64 caracteres
        if (CSRFToken.length < 64) {
          // Se for menor que 64, preencher com caracteres até atingir 64
          const padding = 'X'.repeat(64 - CSRFToken.length);
          CSRFToken = CSRFToken + padding;
          console.log('Token CSRF ajustado com padding em fetchApi:', CSRFToken.length);
        } else if (CSRFToken.length > 64) {
          // Se for maior que 64, truncar para 64 caracteres
          CSRFToken = CSRFToken.substring(0, 64);
          console.log('Token CSRF truncado em fetchApi:', CSRFToken.length);
        }
      }
      
      headers.set('X-Csrftoken', CSRFToken);
    } else {
      console.error('Token CSRF não disponível para requisição:', options.method, url);
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