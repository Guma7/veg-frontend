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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';
  
  const handleSaveProfile = async (updatedProfile: FormData | Partial<UserProfile>, customHeaders?: Record<string, string>) => {
      setIsLoading(true);
      try {
        // Se for FormData, enviar como multipart/form-data
        if (updatedProfile instanceof FormData) {
          // Obter o token CSRF atualizado antes de enviar
          let CSRFToken = '';
          try {
            console.log('Obtendo token CSRF da URL:', `${API_URL}/api/auth/csrf/`);
            const CSRFResponse = await fetch(`${API_URL}/api/auth/csrf/`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (!CSRFResponse.ok) {
              console.error(`Erro ao obter token CSRF: ${CSRFResponse.status} ${CSRFResponse.statusText}`);
            } else {
              const CSRFData = await CSRFResponse.json();
              console.log('Resposta do servidor CSRF:', CSRFData);
              if (CSRFData && CSRFData.CSRFToken) {
                CSRFToken = CSRFData.CSRFToken;
                console.log('Token CSRF obtido da resposta JSON:', CSRFToken);
              }
            }
          } catch (error) {
            console.error('Erro ao atualizar token CSRF:', error);
          }
          
          // Se não obteve o token da resposta JSON, tentar obter do cookie
          if (!CSRFToken) {
            CSRFToken = document.cookie
              .split('; ')
              .find(row => row.startsWith('csrftoken='))
              ?.split('=')[1] || '';
            
            if (CSRFToken) {
              console.log('Token CSRF obtido do cookie:', CSRFToken);
            } else {
              console.warn('Token CSRF não encontrado no cookie');
            }
          }
  
          // Usar headers personalizados se fornecidos, ou criar novos
          const headers: Record<string, string> = customHeaders || {};
          
          // Adicionar o token CSRF ao header se não estiver presente nos headers personalizados
          if (CSRFToken && !headers['X-Csrftoken']) {
        headers['X-Csrftoken'] = CSRFToken;
        console.log('Token CSRF adicionado ao header:', CSRFToken);
      } else if (!headers['X-Csrftoken']) {
            console.warn('Nenhum token CSRF disponível para adicionar ao header');
          }
  
          // Adicionar o token de autorização JWT se não estiver presente nos headers personalizados
          if (!headers['Authorization']) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
              headers['Authorization'] = `Bearer ${accessToken}`;
              console.log('Token de autorização adicionado ao header');
            } else {
              console.warn('Nenhum token de autorização disponível');
            }
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
  
          console.log('Headers enviados:', headers);
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