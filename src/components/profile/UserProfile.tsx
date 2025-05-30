'use client'

import styled from 'styled-components'
import { FaInstagram, FaTwitter, FaGlobe } from 'react-icons/fa'
import { Avatar as AvatarComponent } from '../common/Avatar'

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const ProfileHeader = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
`

const UserInfo = styled.div`
  flex: 1;
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`

interface UserProfileProps {
  user: {
    name: string;
    avatar: string;
    bio: string;
    social?: {
      instagram?: string;
      twitter?: string;
      website?: string;
    };
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarContainer>
          <AvatarComponent
            src={user.avatar}
            alt={user.name}
            size="lg"
          />
        </AvatarContainer>
        <UserInfo>
          <h1>{user.name}</h1>
          <p>{user.bio}</p>
          <SocialLinks>
            {user.social?.instagram && (
              <a href={user.social.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
            )}
            {/* Outros links sociais */}
          </SocialLinks>
        </UserInfo>
      </ProfileHeader>
    </ProfileContainer>
  )
}