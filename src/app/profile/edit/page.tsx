'use client'
import { Container } from '../../../components/ui/Container'
import { Card, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Alert } from '../../../components/ui/Alert'
import ImageUpload from '../../../components/ui/ImageUpload'
import { useAuth } from '../../../contexts/AuthContextFront'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

const EditCard = styled(Card)`
  max-width: 600px;
  margin: ${props => props.theme.spacing['3xl']} auto;
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
`

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.text.disabled};
  border-radius: ${props => props.theme.borderRadius.md};
  min-height: 100px;
  font-family: ${props => props.theme.fonts.primary};
`

export default function EditProfile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    description: '',
    profileImage: null as File | null,
    social_links: {
      instagram: '',
      twitter: '',
      website: ''
    }
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchProfile()
    }
  }, [user, loading])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/profiles/${user?.id}/`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          description: data.description || '',
          social_links: data.social_links || {}
        }))
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const formDataToSend = new FormData()
    formDataToSend.append('description', formData.description)
    formDataToSend.append('social_links', JSON.stringify(formData.social_links))
    if (formData.profileImage) {
      formDataToSend.append('profile_picture', formData.profileImage)
    }

    try {
      const response = await fetch(`http://localhost:8000/api/profiles/${user?.id}/`, {
        method: 'PATCH',
        body: formDataToSend,
        credentials: 'include'
      })

      if (response.ok) {
        router.push('/profile')
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao atualizar perfil')
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  // Obter a imagem de perfil atual do usuário
  const currentProfileImage = user?.profileImage || user?.profile?.profile_picture || '/media/default/default_profile.svg'

  return (
    <Container>
      <EditCard>
        <CardTitle>Editar Perfil</CardTitle>
        {error && <Alert $variant="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Foto de Perfil</Label>
            <ImageUpload
              currentImage={currentProfileImage}
              onImageSelect={(file) => setFormData(prev => ({ ...prev, profileImage: file }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>Descrição</Label>
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Conte um pouco sobre você..."
            />
          </FormGroup>

          <FormGroup>
            <Label>Links Sociais</Label>
            <Input
              type="url"
              placeholder="Instagram"
              value={formData.social_links.instagram}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, instagram: e.target.value }
              }))}
              fullwidth
            />
            <Input
              type="url"
              placeholder="Twitter"
              value={formData.social_links.twitter}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, twitter: e.target.value }
              }))}
              fullwidth
            />
            <Input
              type="url"
              placeholder="Website"
              value={formData.social_links.website}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social_links: { ...prev.social_links, website: e.target.value }
              }))}
              fullwidth
            />
          </FormGroup>

          <Button type="submit" $variant="primary" fullwidth>
            Salvar Alterações
          </Button>
        </form>
      </EditCard>
    </Container>
  )
}
