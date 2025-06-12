import axios from 'axios';

// Usar a variável de ambiente para a URL da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

interface UserData {
  username?: string;
  email?: string;
  password: string;
  identifier?: string;
}

import { AuthResponse } from '../types/auth'

// Função auxiliar para obter o token CSRF
const getCSRFToken = (): string => {
  if (typeof document === 'undefined') {
    console.log('getCSRFToken: document não disponível (SSR)');
    return '';
  }
  
  console.log('=== EXTRAINDO TOKEN DOS COOKIES ===');
  console.log('getCSRFToken: todos os cookies:', document.cookie);
  
  // Verificar se há cookies
  if (!document.cookie) {
    console.log('getCSRFToken: ERRO - Nenhum cookie encontrado!');
    return '';
  }
  
  const cookies = document.cookie.split('; ');
  console.log('getCSRFToken: cookies separados:', cookies);
  
  const cookie = cookies.find(row => row.startsWith('csrftoken='));
  console.log('getCSRFToken: cookie CSRF encontrado:', cookie);
    
  if (cookie) {
    const token = cookie.split('=')[1];
    console.log('getCSRFToken: token extraído:', token);
    console.log('getCSRFToken: comprimento do token:', token.length);
    console.log('getCSRFToken: tipo do token:', typeof token);
    
    // Verificar se o token não está vazio ou undefined
    if (!token || token === 'undefined' || token === 'null') {
      console.error('getCSRFToken: ERRO - Token inválido:', token);
      return '';
    }
    
    return token;
  }
  
  console.log('getCSRFToken: nenhum cookie CSRF encontrado');
  console.log('getCSRFToken: procurando por variações do nome do cookie...');
  
  // Tentar outras variações do nome do cookie
  const variations = ['CSRFToken=', 'csrf_token=', 'X-CSRFToken='];
  for (const variation of variations) {
    const altCookie = cookies.find(row => row.startsWith(variation));
    if (altCookie) {
      console.log(`getCSRFToken: cookie alternativo encontrado (${variation}):`, altCookie);
      return altCookie.split('=')[1];
    }
  }
  
  console.log('=== FIM DA EXTRAÇÃO DOS COOKIES ===');
  return '';
};

// Função para obter o token CSRF do servidor de forma síncrona
export const fetchCSRFToken = async (): Promise<string> => {
  try {
    console.log('=== INICIANDO OBTENÇÃO DE TOKEN CSRF ===');
    console.log('URL da API:', `${API_URL}/api/auth/csrf/`);
    console.log('Cookies antes da requisição:', document.cookie);
    
    // Usar a URL completa do backend
    const response = await fetch(`${API_URL}/api/auth/csrf/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
      throw new Error(`Erro ao obter token CSRF: ${response.status} ${response.statusText}`);
    }
    
    // Tentar obter o token da resposta JSON
    const data = await response.json();
    console.log('Resposta do servidor CSRF:', data);
    
    if (data && data.CSRFToken) {
      console.log('Token CSRF obtido da resposta JSON:', data.CSRFToken);
      console.log('Comprimento do token CSRF (JSON):', data.CSRFToken.length);
      console.log('Tipo do token (JSON):', typeof data.CSRFToken);
      
      // Validar se o token tem o formato correto
      if (data.CSRFToken.length < 32) {
        console.warn('AVISO: Token CSRF muito curto!', data.CSRFToken.length);
      }
      
      return data.CSRFToken;
    }
    
    console.log('Cookies após a requisição:', document.cookie);
    
    // Se não encontrou no JSON, tentar obter do cookie
    const tokenFromCookie = getCSRFToken();
    console.log('Token CSRF obtido do cookie:', tokenFromCookie);
    console.log('Comprimento do token CSRF (cookie):', tokenFromCookie.length);
    
    if (tokenFromCookie && tokenFromCookie.length < 32) {
      console.warn('AVISO: Token CSRF do cookie muito curto!', tokenFromCookie.length);
    }
    
    console.log('=== FIM DA OBTENÇÃO DE TOKEN CSRF ===');
    return tokenFromCookie;
  } catch (err) {
    console.error('Erro ao obter token CSRF:', err);
    return '';
  }
};

class AuthService {
  async login(identifier: string, password: string): Promise<AuthResponse> {
    try {
      const CSRFToken = await fetchCSRFToken();
      
      // Usar 'identifier' como parâmetro para permitir login com email ou nome de usuário
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': CSRFToken,
          'Accept': 'application/json'
        },
        credentials: 'include',  // Importante para manter os cookies de sessão
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro de login:', error);
        
        if (response.status === 401) {
          throw new Error('Credenciais inválidas. Verifique seu nome de usuário/email e senha.');
        } else if (error.message) {
          throw new Error(error.message);
        } else {
          throw new Error('Credenciais inválidas');
        }
      }

      const data = await response.json();
      
      // Armazenar tokens em localStorage como backup
      if (data.access) {
        localStorage.setItem('accessToken', data.access);
      }
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      
      return data;
    } catch (error) {
      console.error('Erro completo durante login:', error);
      throw error;
    }
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Enviando dados de registro:', { username, email, password: '***' });
      
      // Importante: Não remover espaços do nome de usuário
      // Apenas garantir que não há espaços extras no início/fim
      const userData = { 
        username: username.trim(), 
        email, 
        password 
      };
      
      const CSRFToken = await fetchCSRFToken();
      
      console.log('Dados sendo enviados para o servidor:', JSON.stringify(userData));
      
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Csrftoken': CSRFToken
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resposta de erro do servidor:', errorData);
        
        // Tratamento específico para diferentes tipos de erro
        if (errorData.username) {
          throw new Error(`Erro de nome de usuário: ${errorData.username[0]}`);
        } else if (errorData.email) {
          throw new Error(`Erro de email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          throw new Error(`Erro de senha: ${errorData.password[0]}`);
        } else if (errorData.error) {
          throw new Error(errorData.error);
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error('Erro ao registrar usuário. Verifique os dados e tente novamente.');
        }
      }

      const data = await response.json();
      console.log('Resposta de sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro completo durante o registro:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const CSRFToken = await fetchCSRFToken();
      
      await fetch(`${API_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': CSRFToken
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar todos os dados de sessão independentemente do resultado da requisição
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Limpar cookies de sessão
      document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
      
      // Limpar qualquer cache do navegador relacionado à autenticação
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('auth') || name.includes('user')) {
              caches.delete(name);
            }
          });
        });
      }
    }
  }

  async getCurrentUser(): Promise<any | null> {
    try {
      const CSRFToken = await fetchCSRFToken();
      
      // Verificar se há token no localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Csrftoken': CSRFToken,
        'Accept': 'application/json'
      };
      
      // Adicionar token de autorização se disponível
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${API_URL}/api/auth/me/`, {
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      if (!response.ok) {
        // Se o token expirou, tentar renovar com o refresh token
        if (response.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_URL}/api/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Csrftoken': CSRFToken,
                  'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ refresh: refreshToken }),
              });
              
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                localStorage.setItem('accessToken', refreshData.access);
                
                // Tentar novamente com o novo token
                const newHeaders = { ...headers, 'Authorization': `Bearer ${refreshData.access}` };
                const retryResponse = await fetch(`${API_URL}/api/auth/me/`, {
                  credentials: 'include',
                  headers: newHeaders,
                });
                
                if (retryResponse.ok) {
                  return await retryResponse.json();
                }
              }
            } catch (refreshError) {
              console.error('Erro ao renovar token:', refreshError);
            }
          }
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  // Método para renovar o token de acesso usando o refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;
      
      const CSRFToken = await fetchCSRFToken();
      
      const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Csrftoken': CSRFToken,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  }
  
  async profile(): Promise<any | null> {
    try {
      const CSRFToken = await fetchCSRFToken();
      
      // Verificar se há token no localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Csrftoken': CSRFToken,
        'Accept': 'application/json'
      };
      
      // Adicionar token de autorização se disponível
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${API_URL}/api/user/profile/`, {
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });


      if (!response.ok) {
        // Se o token expirou, tentar renovar com o refresh token
        if (response.status === 401) {
          // Tentar renovar o token
          const refreshSuccess = await this.refreshToken();
          if (refreshSuccess) {
            // Tentar novamente com o novo token
            const accessToken = localStorage.getItem('accessToken');
            const newHeaders = { ...headers, 'Authorization': `Bearer ${accessToken}` };
            const retryResponse = await fetch(`${API_URL}/api/user/profile/`, {
              method: 'GET',
              credentials: 'include',
              headers: newHeaders,
            });
            
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          }
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      return null;
    }
  }
}

export const auth = new AuthService();