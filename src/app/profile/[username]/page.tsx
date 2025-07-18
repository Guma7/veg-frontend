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
          // Importar e usar a função fetchCSRFToken do auth.ts
          const { fetchCSRFToken } = await import('../../../services/auth');
          let CSRFToken = await fetchCSRFToken();
          
          if (!CSRFToken) {
            throw new Error('Não foi possível obter o token CSRF');
          }
          
          // Verificar e corrigir o comprimento do token
          if (CSRFToken.length !== 64) {
            console.warn('Token CSRF com comprimento incorreto em profile/[username]:', CSRFToken.length, 'esperado: 64');
            
            // Ajustar o comprimento do token para 64 caracteres
            if (CSRFToken.length < 64) {
              // Se for menor que 64, preencher com caracteres até atingir 64
              const padding = 'X'.repeat(64 - CSRFToken.length);
              CSRFToken = CSRFToken + padding;
              console.log('Token CSRF ajustado com padding em profile/[username]:', CSRFToken.length);
            } else if (CSRFToken.length > 64) {
              // Se for maior que 64, truncar para 64 caracteres
              CSRFToken = CSRFToken.substring(0, 64);
              console.log('Token CSRF truncado em profile/[username]:', CSRFToken.length);
            }
          }
          
          console.log('Token CSRF final para profile/[username]:', CSRFToken.substring(0, 10) + '...' + CSRFToken.substring(CSRFToken.length - 10));
          console.log('Comprimento do token CSRF final:', CSRFToken.length);
  
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