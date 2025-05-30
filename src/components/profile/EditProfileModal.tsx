'use client'
import { useState } from 'react'
import styled from 'styled-components'
import { UserProfile } from '../../types/user'
import { Avatar } from '../common/Avatar'

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  min-height: 100px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
`

const SaveButton = styled(Button)`
  background: ${props => props.theme.colors.primary};
  color: white;
`

const CancelButton = styled(Button)`
  background: ${props => props.theme.colors.background.secondary};
`

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`

interface Props {
  profile: UserProfile
  onSave: (profile: FormData | Partial<UserProfile>) => void
  onClose: () => void
}

export default function EditProfileModal({ profile, onSave, onClose }: Props) {
  const [formData, setFormData] = useState({
    description: profile.description || '',
    profile_image: null as File | null,
    social_links: {
      instagram: profile.socialLinks?.instagram || profile.social_links?.instagram || '',
      youtube: profile.socialLinks?.youtube || profile.social_links?.youtube || '',
      website: profile.socialLinks?.website || profile.social_links?.website || ''
    }
  })
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.profileImage || profile.profile_image || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('description', formData.description)
      
      // Verificar se há uma nova imagem para enviar
      if (formData.profile_image) {
        formDataToSend.append('profile_image', formData.profile_image)
        console.log('Enviando imagem:', formData.profile_image.name, formData.profile_image.type, formData.profile_image.size)
      } else if (previewUrl === null) {
        formDataToSend.append('remove_profile_image', 'true')
      }
      
      formDataToSend.append('social_links', JSON.stringify(formData.social_links))
      
      // Adicionar logs para depuração
      console.log('Enviando dados do formulário:', {
        description: formData.description,
        hasImage: !!formData.profile_image,
        removeImage: previewUrl === null,
        socialLinks: formData.social_links
      })
      
      // Chamar a função onSave com os dados do formulário
      await onSave(formDataToSend)
    } catch (error) {
      console.error('Erro detalhado ao salvar perfil:', error)
      setError(error instanceof Error ? error.message : 'Erro ao salvar perfil. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validar o tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Formato de imagem inválido. Use JPEG, PNG, GIF ou WebP.')
      return
    }
    
    // Validar o tamanho do arquivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.')
      return
    }
    
    const objectUrl = URL.createObjectURL(file)
    
    // Validar dimensões da imagem
    const img = new Image()
    img.onload = function() {
      URL.revokeObjectURL(objectUrl)
      
      if (img.width > 2000 || img.height > 2000) {
        setError('A imagem deve ter no máximo 2000x2000 pixels.')
        return
      }
      
      setFormData({ ...formData, profile_image: file })
      setPreviewUrl(objectUrl)
      setError(null)
    }
    
    img.onerror = function() {
      URL.revokeObjectURL(objectUrl)
      setError('Erro ao carregar a imagem. Tente outro arquivo.')
    }
    
    img.src = objectUrl
  }

  return (
    <Modal>
      <ModalContent>
        <h2>Editar Perfil</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <div>
            <label>Foto de Perfil</label>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Avatar 
                src={previewUrl} 
                alt={profile.username || 'Perfil'} 
                size="lg" 
              />
              {previewUrl && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setPreviewUrl(null);
                      setFormData({ ...formData, profile_image: null });
                    }}
                    style={{ 
                      background: '#f44336', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Remover imagem
                  </button>
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label>Descrição</label>
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Escreva algo sobre você..."
            />
          </div>

          <div>
            <label>Instagram</label>
            <Input
              type="text"
              value={formData.social_links.instagram}
              onChange={(e) => setFormData({
                ...formData,
                social_links: {
                  ...formData.social_links,
                  instagram: e.target.value
                }
              })}
              placeholder="URL do seu Instagram"
            />
          </div>

          <div>
            <label>YouTube</label>
            <Input
              type="text"
              value={formData.social_links.youtube}
              onChange={(e) => setFormData({
                ...formData,
                social_links: {
                  ...formData.social_links,
                  youtube: e.target.value
                }
              })}
              placeholder="URL do seu canal no YouTube"
            />
          </div>

          <div>
            <label>Website</label>
            <Input
              type="text"
              value={formData.social_links.website}
              onChange={(e) => setFormData({
                ...formData,
                social_links: {
                  ...formData.social_links,
                  website: e.target.value
                }
              })}
              placeholder="URL do seu website"
            />
          </div>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SaveButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  )
}