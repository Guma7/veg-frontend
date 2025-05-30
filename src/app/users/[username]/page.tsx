'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import styled from 'styled-components'
import UserRecipesFeed from '../../../components/profile/UserRecipesFeed'
import { Avatar } from '../../../components/common/Avatar'

const ProfileContainer = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`

const ProfileHeader = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  align-items: center;
`

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => props.theme.colors.background.paper};
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ProfileInfo = styled.div`
  flex: 1;
`

const Username = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.md};
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

interface Profile {
  id: string
  username: string
  description: string
  profileImage: string | null
  socialLinks: {
    instagram: string
    youtube: string
    website: string
  }
}

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const actualParams = params
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [params.username])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${params.username}/`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Perfil não encontrado')
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>
  if (!profile) return <div>Perfil não encontrado</div>

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileImage>
          <Avatar 
            src={profile.profileImage} 
            alt={profile.username || 'Perfil'} 
            size="lg" 
          />
        </ProfileImage>
        <ProfileInfo>
          <Username>{profile.username}</Username>
          <Description>{profile.description}</Description>
          <SocialLinks>
            {profile.socialLinks.instagram && (
              <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {profile.socialLinks.youtube && (
              <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            )}
            {profile.socialLinks.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            )}
          </SocialLinks>
        </ProfileInfo>
      </ProfileHeader>

      <UserRecipesFeed userId={profile.id} />
    </ProfileContainer>
  )
}