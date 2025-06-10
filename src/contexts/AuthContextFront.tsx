'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { auth } from '../services/auth'
import { AuthResponse } from '../types/auth'

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  profileImage?: string;
  profile?: {
    description?: string;
    profile_picture?: string;  // Adicionando esta propriedade
    social_links?: {
      instagram?: string;
      youtube?: string;
      website?: string;
    }
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (identifier: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  clearError: () => void
  updateUserData: () => Promise<boolean> // Adicionar esta função
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para verificar autenticação
  const checkAuth = async () => {
    try {
      const userData = await auth.getCurrentUser()
      if (userData) {
        setUser(userData)
      } else {
        // Se não conseguir obter o usuário, limpar dados de sessão inválidos
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            console.log('Tentando renovar sessão com refresh token');
            // Se falhar na renovação, limpar tudo
            const renewedUser = await auth.getCurrentUser();
            if (!renewedUser) {
              throw new Error('Falha na renovação da sessão');
            }
            setUser(renewedUser);
          } catch (refreshError) {
            console.error('Erro ao renovar sessão:', refreshError);
            // Limpar dados de sessão inválidos
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          // Não há refresh token, garantir que não há dados órfãos
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      // Em caso de erro, limpar dados potencialmente corrompidos
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Adicionar função para atualizar dados do usuário
  const updateUserData = async () => {
    try {
      const userData = await auth.getCurrentUser()
      if (userData) {
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error)
      return false
    }
  }

  const login = async (identifier: string, password: string) => {
    setError(null)
    try {
      const userData = await auth.login(identifier, password)
      
      // Verificar se temos dados de usuário na resposta
      if (userData && userData.user) {
        // Garantir que temos todos os dados necessários
        const completeUserData = {
          ...userData.user,
          // Garantir que o ID está presente
          id: userData.user.id,
          // Garantir que temos dados de perfil
          profile: userData.user.profile || {}
        }
        
        setUser(completeUserData)
        console.log('Usuário logado com sucesso:', completeUserData)
      } else {
        // Se não temos dados de usuário, tentar obter do getCurrentUser
        console.log('Dados de usuário não encontrados na resposta de login, tentando getCurrentUser')
        const currentUser = await auth.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          console.log('Usuário obtido com getCurrentUser:', currentUser)
        } else {
          throw new Error('Não foi possível obter dados do usuário após login')
        }
      }
    } catch (error) {
      console.error('Erro detalhado no login:', error)
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('Iniciando registro com dados:', { username, email });
      const userData = await auth.register(username, email, password);
      console.log('Registro bem-sucedido:', userData);
      setUser(userData.user);
      return userData;
    } catch (error) {
      console.error('Erro durante o registro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
      
      // Limpar completamente o estado do usuário
      setUser(null)
      setError(null)
      
      // Forçar uma limpeza adicional do localStorage
      localStorage.clear()
      
      // Redirecionar para a página inicial após logout
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      
      // Mesmo com erro, limpar o estado local
      setUser(null)
      setError(null)
      localStorage.clear()
      window.location.href = '/';
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      clearError,
      updateUserData // Adicionar a nova função ao contexto
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}