'use client'
import { useState, useEffect } from 'react';
import { UserProfile } from '../../../types/user';

// Definição simples dos parâmetros
type PageProps = {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: PageProps) {
  // Decodificar o nome de usuário da URL
  const decodedUsername = decodeURIComponent(params.username);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Importar a variável API_URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-api.onrender.com';
  
  const handleSaveProfile = async (updatedProfile: FormData | Partial<UserProfile>) => {
      setIsLoading(true);
      try {
        // Se for FormData, enviar como multipart/form-data
        if (updatedProfile instanceof FormData) {
          // Obter o token CSRF atualizado antes de enviar
          let csrfToken = '';
          try {
            console.log('Obtendo token CSRF da URL:', `${API_URL}/api/auth/csrf/`);
            const csrfResponse = await fetch(`${API_URL}/api/auth/csrf/`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (!csrfResponse.ok) {
              console.error(`Erro ao obter token CSRF: ${csrfResponse.status} ${csrfResponse.statusText}`);
            } else {
              const csrfData = await csrfResponse.json();
              console.log('Resposta do servidor CSRF:', csrfData);
              if (csrfData && csrfData.csrfToken) {
                csrfToken = csrfData.csrfToken;
                console.log('Token CSRF obtido da resposta JSON:', csrfToken);
              }
            }
          } catch (error) {
            console.error('Erro ao atualizar token CSRF:', error);
          }
          
          // Se não obteve o token da resposta JSON, tentar obter do cookie
          if (!csrfToken) {
            csrfToken = document.cookie
              .split('; ')
              .find(row => row.startsWith('csrftoken='))
              ?.split('=')[1] || '';
            
            if (csrfToken) {
              console.log('Token CSRF obtido do cookie:', csrfToken);
            } else {
              console.warn('Token CSRF não encontrado no cookie');
            }
          }
  
          // Adicionar o token CSRF ao header
          const headers: Record<string, string> = {};
          if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
            console.log('Token CSRF adicionado ao header:', csrfToken);
          } else {
            console.warn('Nenhum token CSRF disponível para adicionar ao header');
          }
  
          // Usar a URL completa do backend
          console.log('Enviando dados para atualização de perfil: FormData com imagem');
          console.log('Enviando para URL:', `${API_URL}/api/auth/profile/`);
          const response = await fetch(`${API_URL}/api/auth/profile/`, {
            method: 'PUT',
            headers: headers,
            body: updatedProfile,
            credentials: 'include', // Importante para enviar cookies
            // Não definir Content-Type, o navegador vai definir automaticamente com boundary
          });
          
          console.log('Resposta da API:', response.status, response.statusText);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro detalhado:', errorText);
            throw new Error(`Erro ao atualizar perfil: ${response.status} - ${errorText}`);
          }
          
          const updatedData = await response.json();
          console.log('Dados atualizados recebidos:', updatedData);
          
          // Atualizar o estado com os dados atualizados
          setProfile((prev: UserProfile | null) => {
            if (!prev) return updatedData; // Se prev for null, retornar apenas os dados atualizados
            
            return {
              ...prev,
              ...updatedData,
              // Forçar atualização da imagem adicionando timestamp
              profileImage: updatedData.profile_image ? 
                `${updatedData.profile_image}?t=${new Date().getTime()}` : 
                null
            };
          });
        
          // Forçar recarregamento da página para atualizar todos os componentes
          window.location.reload();
        } else {
          // Código para atualizações que não são FormData
          // Implementar conforme necessário
        }
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar o perfil do usuário
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/user/${encodeURIComponent(decodedUsername)}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar o perfil');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [decodedUsername]);
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!profile) return <div>Perfil não encontrado</div>;
  
  return (
    <div>
      {/* Conteúdo do perfil */}
      <h1>{profile.username}</h1>
      {/* Resto do conteúdo */}
    </div>
  );
}