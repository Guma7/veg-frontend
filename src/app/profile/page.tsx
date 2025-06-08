'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContextFront'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { FaInstagram, FaYoutube, FaGlobe, FaEdit, FaPlus, FaTrash, FaPen } from 'react-icons/fa'
import EditProfileModal from '../../components/profile/EditProfileModal'
import { auth } from '../../services/auth'
import { Avatar } from '../../components/common/Avatar'
import ActionButton from '../../components/common/ActionButton'
import Link from 'next/link'
import { deleteRecipe } from '../../services/recipeService'
import { Loading } from '../../components/ui/Loading'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const ProfileContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`

const ProfileLayout = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const ProfileSidebar = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 2rem;
  }
`

const ProfileContent = styled.div`
  flex: 1;
`

// Variáveis configuráveis para a imagem de perfil
const profileImageConfig = {
  containerSize: '110px',  // Tamanho do container (ajustável: 150px, 180px, etc)
  imageSize: '110%',       // Tamanho da imagem (ajustável: 100%, 110%, 120%, etc)
  borderWidth: '1px',      // Largura da borda (ajustável: 1px, 2px, 3px, etc)
  borderRadius: '50%',     // Raio da borda (ajustável: 50%, 40%, etc)
};

const ProfileImage = styled.div`
  width: ${profileImageConfig.containerSize};
  height: ${profileImageConfig.containerSize};
  border-radius: ${profileImageConfig.borderRadius};
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: ${profileImageConfig.borderWidth} solid ${props => props.theme.colors.primary};
  box-shadow: none;
  position: relative;
  z-index: 1;
  img {
    width: ${profileImageConfig.imageSize};
    height: ${profileImageConfig.imageSize};
    object-fit: cover;
    border-radius: ${profileImageConfig.borderRadius};
    box-shadow: none;
  }
`

const Username = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  text-align: center;
`

const UserDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: center;
`

const SocialIcon = styled.a`
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
`

const ProfileActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-bottom: 0.75rem;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`

const RecipeCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`

const RecipeImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`

const RecipeContent = styled.div`
  padding: 1rem;
`

const RecipeActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f8f8f8;
`

const RecipeActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`

const DeleteButton = styled(ActionButton)`
  background: #e74c3c;
  
  &:hover {
    background: #c0392b;
  }
`

const RecipeTitle = styled.h3`
  margin-bottom: 0.5rem;
`

const RecipeDescription = styled.p`
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const LoadingContainer = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

// Variáveis configuráveis para os botões de ação
const buttonConfig = {
  marginTop: '1rem',  // Espaçamento entre botões (ajustável: +1rem, -0.5rem, etc)
  width: '100%',      // Largura do botão (ajustável: 90%, 200px, etc)
  padding: '0.5rem 1rem', // Padding interno (ajustável)
  fontSize: '1rem',   // Tamanho da fonte (ajustável)
  iconSize: '1rem',   // Tamanho do ícone (ajustável)
  iconMargin: '-1px', // Margem do ícone (ajustável: -1px, 0.5rem, etc)
};

// Estilo personalizado para os botões de ação
const StyledActionButton = styled(ActionButton)`
  width: ${buttonConfig.width};
  padding: ${buttonConfig.padding};
  font-size: ${buttonConfig.fontSize};
  
  svg {
    font-size: ${buttonConfig.iconSize};
    margin-right: ${buttonConfig.iconMargin};
  }
`;

export default function ProfilePage() {
  const { user, loading: authLoading, updateUserData } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [recipes, setRecipes] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchUserRecipes()
    } else if (!authLoading) {
      // Só definimos o erro se a autenticação já terminou de carregar
      // e não temos um usuário
      setLoading(false)
      setError('Usuário não autenticado. Faça login para acessar seu perfil.')
    }
  }, [user, authLoading])

  const fetchUserProfile = async () => {
    try {
      const data = await auth.profile()
      if (data) {
        // Adicionar timestamp para evitar cache da imagem
        const timestamp = new Date().getTime()
        const profileImageUrl = data.profile_image || data.profileImage
        // Garantir que a URL da imagem tenha um timestamp único para evitar cache
        const finalImageUrl = profileImageUrl ? 
          (profileImageUrl.includes('?') ? `${profileImageUrl}&t=${timestamp}` : `${profileImageUrl}?t=${timestamp}`) : 
          '/media/default/default_profile.svg'
        
        console.log('URL da imagem de perfil:', finalImageUrl)
        
        setUserProfile({
          id: user?.id,
          username: user?.username,
          ...data,
          profileImage: finalImageUrl,
          profile_image: finalImageUrl, // Garantir que ambas as propriedades estejam definidas
          description: data.description || '',
          socialLinks: {
            instagram: data.social_links?.instagram || data.socialLinks?.instagram || '',
            youtube: data.social_links?.youtube || data.socialLinks?.youtube || '',
            website: data.social_links?.website || data.socialLinks?.website || ''
          },
          social_links: data.social_links || data.socialLinks || {}
        })
        console.log('Perfil carregado:', data)
        setError(null)
      } else {
        setError('Não foi possível carregar o perfil')
      }
    } catch (error) {
      setError('Erro ao carregar perfil')
      console.error('Erro detalhado:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipes/user/${user?.id}/`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
    }
  }
  
  const handleEditRecipe = (slug: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/receitas/editar/${slug}`)
  }
  
  const handleDeleteRecipe = async (slug: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.confirm('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')) {
      try {
        await deleteRecipe(slug)
        // Atualizar a lista de receitas após a exclusão
        fetchUserRecipes()
        alert('Receita excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir receita:', error)
        alert('Erro ao excluir receita. Tente novamente.')
      }
    }
  }

  const handleSaveProfile = async (profileData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      // Obter o token CSRF do cookie se disponível
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      // Preparar os headers com o token CSRF
      const headers: Record<string, string> = {};
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
        console.log('Token CSRF adicionado aos headers:', csrfToken);
      } else {
        // Tentar obter o token CSRF diretamente do servidor
        try {
          const csrfResponse = await fetch(`${API_URL}/api/auth/csrf/`, {
            method: 'GET',
            credentials: 'include'
          });
          
          if (csrfResponse.ok) {
            const csrfData = await csrfResponse.json();
            if (csrfData.csrfToken) {
              headers['X-CSRFToken'] = csrfData.csrfToken;
              console.log('Token CSRF obtido da resposta e adicionado aos headers:', csrfData.csrfToken);
            }
          }
        } catch (error) {
          console.error('Erro ao obter token CSRF do servidor:', error);
        }
      }
      
      // Adicionar o token de autorização JWT se disponível
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('Token de autorização adicionado aos headers');
      }
      
      if (!(profileData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      
      console.log('Enviando dados para atualização de perfil:', 
        profileData instanceof FormData ? 
        'FormData com ' + (profileData.has('profile_image') ? 'imagem' : 'sem imagem') : 
        'JSON data')
      
      const response = await fetch(`${API_URL}/api/auth/profile/`, {
        method: 'PUT',
        credentials: 'include',
        body: profileData instanceof FormData ? profileData : JSON.stringify(profileData),
        headers: headers
      })
      
      // Adicionar logs para depuração
      console.log('Headers enviados:', headers)
      console.log('Status da resposta:', response.status)

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Resposta de erro completa:', errorText);
        const errorData = errorText ? JSON.parse(errorText) : null;
        throw new Error(errorData?.detail || `Erro ao atualizar perfil: ${response.status} ${response.statusText}`)
      }
      
      // Forçar uma pequena pausa para garantir que o servidor processou a imagem
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Recarregar o perfil com um timestamp único para evitar cache
      await fetchUserProfile()
      
      setIsEditModalOpen(false)
      alert('Perfil atualizado com sucesso!')
      await updateUserData(); // Atualiza o usuário global após salvar o perfil
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao atualizar perfil')
      alert(error instanceof Error ? error.message : 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRecipe = () => {
    router.push('/receitas/nova')
    console.log('Navegando para criação de receita')
  }

  // Mostrar o componente de carregamento enquanto a autenticação está sendo verificada
  if (authLoading) {
    return (
      <LoadingContainer>
        <Loading text="Loading..." />
      </LoadingContainer>
    )
  }

  // Mostrar o componente de carregamento enquanto os dados do perfil estão sendo carregados
  if (loading && user) {
    return (
      <LoadingContainer>
        <Loading text="Loading..." />
      </LoadingContainer>
    )
  }

  if (error && !userProfile) {
    return (
      <ProfileContainer>
        <div>{error}</div>
      </ProfileContainer>
    )
  }

  if (!userProfile && !loading) {
    return (
      <ProfileContainer>
        <div>Não foi possível carregar o perfil</div>
      </ProfileContainer>
    )
  }

  return (
    <ProfileContainer>
      <ProfileLayout>
        <ProfileSidebar>
          <ProfileImage>
            <Avatar 
              src={userProfile.profileImage} 
              alt={userProfile.username || 'Perfil'} 
              size="lg" 
            />
          </ProfileImage>
          
          <Username>{userProfile.username}</Username>
          
          <UserDescription>
            {userProfile.description || 'Nenhuma descrição disponível'}
          </UserDescription>
          
          <SocialLinks>
            {userProfile.socialLinks.instagram && (
              <SocialIcon href={userProfile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </SocialIcon>
            )}
            {userProfile.socialLinks.youtube && (
              <SocialIcon href={userProfile.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </SocialIcon>
            )}
            {userProfile.socialLinks.website && (
              <SocialIcon href={userProfile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                <FaGlobe />
              </SocialIcon>
            )}
          </SocialLinks>
          
          <StyledActionButton onClick={() => setIsEditModalOpen(true)}>            
            <FaEdit /> Editar Perfil
          </StyledActionButton>
          
          {/* Botão separado com margem superior configurável */}
          <StyledActionButton 
            onClick={handleCreateRecipe} 
            style={{ marginTop: buttonConfig.marginTop }}
          >
            <FaPlus /> Criar Receita
          </StyledActionButton>
        </ProfileSidebar>
        
        <ProfileContent>
          <h2>Minhas Receitas</h2>
          {recipes.length > 0 ? (
            <RecipeGrid>
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id}>
                  <Link href={`/receitas/${recipe.slug || recipe.id}`} style={{ textDecoration: 'none' }}>
                    <RecipeImage 
                      src={recipe.image_url || (recipe.image ? (recipe.image.startsWith('http') ? recipe.image : recipe.image.startsWith('/') ? `${API_URL}${recipe.image}` : `${API_URL}/${recipe.image}`) : '/default-recipe.svg')}
                      alt={recipe.title} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.onerror = null
                        target.src = '/default-recipe.svg'
                      }}
                    />
                    <RecipeContent>
                      <RecipeTitle>{recipe.title}</RecipeTitle>
                      <RecipeDescription>
                        {recipe.description?.substring(0, 100)}{recipe.description?.length > 100 ? '...' : ''}
                      </RecipeDescription>
                    </RecipeContent>
                  </Link>
                  <RecipeActions>
                    <ActionButton onClick={(e) => handleEditRecipe(recipe.slug || recipe.id.toString(), e)}>
                      <FaPen size={14} />
                    </ActionButton>
                    <DeleteButton onClick={(e) => handleDeleteRecipe(recipe.slug || recipe.id.toString(), e)}>
                      <FaTrash size={14} />
                    </DeleteButton>
                  </RecipeActions>
                </RecipeCard>
              ))}
            </RecipeGrid>
          ) : (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              background: '#f9f9f9', 
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <p>Você ainda não possui receitas cadastradas.</p>
              <p>Clique em "Criar Receita" para adicionar sua primeira receita!</p>
            </div>
          )}
        </ProfileContent>
      </ProfileLayout>
      
      {isEditModalOpen && (
        <EditProfileModal 
          profile={userProfile} 
          onSave={handleSaveProfile} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </ProfileContainer>
  )
}