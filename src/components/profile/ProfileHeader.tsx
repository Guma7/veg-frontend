'use client'
import styled from 'styled-components'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Avatar } from '../common/Avatar'

const ProfileCard = styled(Card)`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
`

const ProfileInfo = styled.div`
  flex: 1;
`

const Username = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`

// Definindo a interface para o perfil do usuário
interface UserProfile {
  username: string;
  description?: string;
  profileImage?: string;
  profile_image?: string;
  social_links?: Record<string, string>;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

interface ProfileHeaderProps {
  user: {
    username: string;
    profile: {
      description: string;
      profile_picture?: string;
      profile_image?: string;
      social_links: Record<string, string>;
    };
  };
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({ user, isOwnProfile, onEdit }: ProfileHeaderProps) {
  return (
    <ProfileCard>
      <ProfileImage>
        <Avatar 
          src={user.profile.profile_image || user.profile.profile_picture} 
          alt={user.username} 
          size="lg" 
        />
      </ProfileImage>
      
      <ProfileInfo>
        <Username>{user.username}</Username>
        <Description>{user.profile.description || 'Nenhuma descrição disponível'}</Description>
        
        {isOwnProfile && (
          <Button $variant="outline" onClick={onEdit}>
            Editar Perfil
          </Button>
        )}
        
        <SocialLinks>
          {Object.entries(user.profile.social_links || {}).map(([platform, url]) => (
            <a key={platform} href={String(url)} target="_blank" rel="noopener noreferrer">
              {platform}
            </a>
          ))}
        </SocialLinks>
      </ProfileInfo>
    </ProfileCard>
  )
}