'use client'

import styled from 'styled-components'
import { FaEdit, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa'
import { RecipeGrid } from '../recipe/RecipeGrid'
import { Avatar } from '../common/Avatar'

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const ProfileMain = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
`

const ProfileSidebar = styled.div`
  width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProfileFeed = styled.div`
  flex: 1;
`

const ProfileImage = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background: ${props => props.theme.colors.background.paper};
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  
  a {
    color: ${props => props.theme.colors.primary};
    &:hover {
      color: ${props => props.theme.colors.primaryLight};
    }
  }
`

export function UserProfile({ user, recipes, isOwnProfile }: UserProfileProps) {
  return (
    <ProfileContainer>
      <ProfileMain>
        <ProfileSidebar>
          <ProfileImage>
            <Avatar
              src={user.profileImage}
              alt={user.username}
              size="lg"
            />
          </ProfileImage>
          <h1 style={{ marginTop: 16 }}>{user.username}</h1>
          {isOwnProfile && (
            <a href="/profile/edit" style={{ width: '100%' }}>
              <EditButton style={{ width: '100%', marginTop: 12 }}>
                <FaEdit /> Editar Perfil
              </EditButton>
            </a>
          )}
          <p style={{ marginTop: 16, textAlign: 'center' }}>{user.description}</p>
          <SocialLinks>
            {user.socialLinks.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <FaGithub size={24} />
              </a>
            )}
            {user.socialLinks.instagram && (
              <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
            )}
            {user.socialLinks.twitter && (
              <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} />
              </a>
            )}
          </SocialLinks>
          {isOwnProfile && (
            <a href="/receitas/criar" style={{ marginTop: 24, width: '100%' }}>
              <EditButton style={{ width: '100%' }}>Criar Receita</EditButton>
            </a>
          )}
        </ProfileSidebar>
        <ProfileFeed>
          <h2>Receitas</h2>
          <RecipeGrid recipes={recipes} />
        </ProfileFeed>
      </ProfileMain>
    </ProfileContainer>
  )
}

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.background.hover};
  }
`

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    profileImage: string;
    description: string;
    socialLinks: {
      github?: string;
      instagram?: string;
      twitter?: string;
    };
  };
  recipes: any[];
  isOwnProfile: boolean;
}