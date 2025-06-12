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
export const getCSRFToken = (): string => {
  try {
    if (typeof document === 'undefined') {
      console.log('getCSRFToken: document não disponível (SSR)');
      return '';
    }
    
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('csrftoken=')) {
        let token = cookie.substring('csrftoken='.length, cookie.length);
        console.log('Token CSRF encontrado no cookie:', token);
        console.log('Comprimento do token CSRF:', token.length);
        
        // Verificar e corrigir o comprimento do token
        if (token.length !== 64) {
          console.warn('Token CSRF do cookie com comprimento incorreto:', token.length, 'esperado: 64');
          
          // Ajustar o comprimento do token para 64 caracteres
          if (token.length < 64) {
            // Se for menor que 64, preencher com caracteres até atingir 64
            const padding = 'X'.repeat(64 - token.length);
            token = token + padding;
            console.log('Token CSRF do cookie ajustado com padding:', token.length);
          } else if (token.length > 64) {
            // Se for maior que 64, truncar para 64 caracteres
            token = token.substring(0, 64);
            console.log('Token CSRF do cookie truncado:', token.length);
          }
        }
        
        return token;
      }
    }
    console.warn('Token CSRF não encontrado nos cookies');
    return '';
  } catch (err) {
    console.error('Erro ao obter token CSRF dos cookies:', err);
    return '';
  }
};

// Função para obter o token CSRF do servidor de forma síncrona
export const fetchCSRFToken = async (): Promise<string> => {
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
    
    let csrfToken = '';
    
    if (data && data.CSRFToken) {
      csrfToken = data.CSRFToken;
      console.log('Token CSRF obtido da resposta JSON:', csrfToken);
      console.log('Comprimento do token CSRF (JSON):', csrfToken.length);
    } else {
      // Se não encontrou no JSON, tentar obter do cookie
      csrfToken = getCSRFToken();
      console.log('Token CSRF obtido do cookie:', csrfToken);
      console.log('Comprimento do token CSRF (cookie):', csrfToken.length);
    }
    
    // Verificar e corrigir o comprimento do token
    if (csrfToken) {
      if (csrfToken.length !== 64) {
        console.warn('Token CSRF com comprimento incorreto:', csrfToken.length, 'esperado: 64');
        
        // Ajustar o comprimento do token para 64 caracteres
        if (csrfToken.length < 64) {
          // Se for menor que 64, preencher com caracteres até atingir 64
          const padding = 'X'.repeat(64 - csrfToken.length);
          csrfToken = csrfToken + padding;
          console.log('Token CSRF ajustado com padding:', csrfToken.length);
        } else if (csrfToken.length > 64) {
          // Se for maior que 64, truncar para 64 caracteres
          csrfToken = csrfToken.substring(0, 64);
          console.log('Token CSRF truncado:', csrfToken.length);
        }
      }
      
      return csrfToken;
    }
    
    console.error('Não foi possível obter um token CSRF válido');
    return '';
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