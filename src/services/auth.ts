import axios from 'axios';

// Usar a variável de ambiente para a URL da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-api.onrender.com';

interface UserData {
  username?: string;
  email?: string;
  password: string;
  identifier?: string;
}

import { AuthResponse } from '../types/auth'

// Função auxiliar para obter o token CSRF
const getCsrfToken = (): string => {
  if (typeof document === 'undefined') return '';
  
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
    
  if (cookie) {
    return cookie.split('=')[1];
  }
  
  return '';
};

// Função para obter o token CSRF do servidor de forma síncrona
const fetchCsrfToken = async (): Promise<string> => {
  try {
    console.log('Obtendo token CSRF do servidor:', `${API_URL}/api/auth/csrf/`);
    
    // Usar a URL completa do backend
    const response = await fetch(`${API_URL}/api/auth/csrf/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao obter token CSRF: ${response.status} ${response.statusText}`);
    }
    
    // Tentar obter o token da resposta JSON
    const data = await response.json();
    console.log('Resposta do servidor CSRF:', data);
    
    if (data && data.csrfToken) {
      console.log('Token CSRF obtido da resposta JSON');
      return data.csrfToken;
    }
    
    // Se não encontrou no JSON, tentar obter do cookie
    const tokenFromCookie = getCsrfToken();
    console.log('Token CSRF obtido do cookie:', tokenFromCookie ? 'Sim' : 'Não');
    
    return tokenFromCookie;
  } catch (err) {
    console.error('Erro ao obter token CSRF:', err);
    return '';
  }
};

class AuthService {
  async login(identifier: string, password: string): Promise<AuthResponse> {
    try {
      const csrfToken = await fetchCsrfToken();
      
      // Usar 'identifier' como parâmetro para permitir login com email ou nome de usuário
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
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
      
      const csrfToken = await fetchCsrfToken();
      
      console.log('Dados sendo enviados para o servidor:', JSON.stringify(userData));
      
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRFToken': csrfToken
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
      const csrfToken = await fetchCsrfToken();
      
      await fetch(`${API_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  async getCurrentUser(): Promise<any | null> {
    try {
      const csrfToken = await fetchCsrfToken();
      
      // Verificar se há token no localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
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
                  'X-CSRFToken': csrfToken,
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
      
      const csrfToken = await fetchCsrfToken();
      
      const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
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
      const csrfToken = await fetchCsrfToken();
      
      // Verificar se há token no localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
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

// Função para obter o token CSRF do cookie
export function getCookieValue(name: string): string {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift() || ''
    console.log(`Valor do cookie ${name} obtido:`, cookieValue)
    return cookieValue
  }
  console.warn(`Cookie ${name} não encontrado`)
  return ''
}

// Função para obter o token CSRF do servidor ou do cookie
export async function getCsrfToken(): Promise<string> {
  try {
    console.log('Tentando obter token CSRF do servidor...')
    // Primeiro, tenta obter o token do servidor
    const response = await fetch(`${API_URL}/api/auth/csrf/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      if (data && data.csrfToken) {
        console.log('Token CSRF obtido com sucesso do servidor:', data.csrfToken)
        return data.csrfToken
      }
    } else {
      console.warn('Falha ao obter token CSRF do servidor. Status:', response.status)
    }
  } catch (error) {
    console.error('Erro ao obter token CSRF do servidor:', error)
  }

  // Se não conseguir obter do servidor, tenta obter do cookie
  console.log('Tentando obter token CSRF do cookie...')
  const cookieToken = getCookieValue('csrftoken')
  
  if (cookieToken) {
    console.log('Token CSRF obtido com sucesso do cookie:', cookieToken)
    return cookieToken
  }
  
  console.error('Não foi possível obter o token CSRF nem do servidor nem do cookie')
  return ''
}

export class AuthService {
  async login(username: string, password: string) {
    try {
      // Obter o token CSRF antes de fazer login
      const csrfToken = await getCsrfToken()
      console.log('Token CSRF para login:', csrfToken)
      
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Accept', 'application/json')
      headers.append('X-CSRFToken', csrfToken)
      
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido' }))
        throw new Error(errorData.detail || 'Falha na autenticação')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  async register(userData: any) {
    try {
      // Obter o token CSRF antes de registrar
      const csrfToken = await getCsrfToken()
      console.log('Token CSRF para registro:', csrfToken)
      
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Accept', 'application/json')
      headers.append('X-CSRFToken', csrfToken)
      
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido' }))
        throw new Error(errorData.detail || 'Falha no registro')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  }

  async logout() {
    try {
      // Obter o token CSRF antes de fazer logout
      const csrfToken = await getCsrfToken()
      console.log('Token CSRF para logout:', csrfToken)
      
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Accept', 'application/json')
      headers.append('X-CSRFToken', csrfToken)
      
      const response = await fetch(`${API_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido' }))
        throw new Error(errorData.detail || 'Falha no logout')
      }

      return true
    } catch (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  }
}