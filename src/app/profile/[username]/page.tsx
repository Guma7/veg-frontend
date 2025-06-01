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
  
  const handleSaveProfile = async (updatedProfile: FormData | Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      // Se for FormData, enviar como multipart/form-data
      if (updatedProfile instanceof FormData) {
        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          body: updatedProfile,
          // Não definir Content-Type, o navegador vai definir automaticamente com boundary
        });
        
        if (!response.ok) {
          throw new Error(`Erro ao atualizar perfil: ${response.status}`);
        }
        
        const updatedData = await response.json();
        
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