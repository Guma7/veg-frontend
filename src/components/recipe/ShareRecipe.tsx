'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink, FaCheck } from 'react-icons/fa'

const ShareContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ShareButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primary}; /* Fallback to primary color since primaryDark doesn't exist */
  }

  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`

const CopyButton = styled(ShareButton)<{ $copied: boolean }>`
  background-color: ${props => props.$copied ? props.theme.colors.success : props.theme.colors.primary};
`

const ShareFeedback = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.success};
  text-align: center;
`

interface ShareRecipeProps {
  recipeId: string;
  recipeTitle: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
  };
}

export function ShareRecipe({ recipeId, recipeTitle, socialLinks = {} }: ShareRecipeProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')

  const recipeUrl = `${window.location.origin}/receitas/${recipeId}`
  const encodedTitle = encodeURIComponent(recipeTitle)
  const encodedUrl = encodeURIComponent(recipeUrl)

  // Definir links padrão para compartilhamento
  const defaultShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
  }
  
  // Verificar se há links personalizados configurados
  const hasFacebook = !!socialLinks.facebook
  const hasTwitter = !!socialLinks.twitter
  const hasWhatsapp = !!socialLinks.whatsapp
  
  // Se não houver nenhum link personalizado, usar os links padrão
  const hasAnySocialLink = hasFacebook || hasTwitter || hasWhatsapp
  
  // Combinar links personalizados com os padrão
  const shareLinks = {
    facebook: socialLinks.facebook || defaultShareLinks.facebook,
    twitter: socialLinks.twitter || defaultShareLinks.twitter,
    whatsapp: socialLinks.whatsapp || defaultShareLinks.whatsapp
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    setFeedback(`Compartilhado no ${platform}!`)
    setTimeout(() => setFeedback(''), 3000)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(recipeUrl)
      setCopied(true)
      setFeedback('Link copiado para a área de transferência!')
      setTimeout(() => {
        setCopied(false)
        setFeedback('')
      }, 3000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
      setFeedback('Não foi possível copiar o link')
    }
  }

  return (
    <ShareContainer>
      <ShareButtons>
        {/* Mostrar botão do Facebook apenas se houver link configurado ou se não houver nenhum link personalizado */}
        {(hasFacebook || !hasAnySocialLink) && (
          <ShareButton
            onClick={() => handleShare('facebook')}
            aria-label="Compartilhar no Facebook"
          >
            <FaFacebook /> Facebook
          </ShareButton>
        )}

        {/* Mostrar botão do Twitter apenas se houver link configurado ou se não houver nenhum link personalizado */}
        {(hasTwitter || !hasAnySocialLink) && (
          <ShareButton
            onClick={() => handleShare('twitter')}
            aria-label="Compartilhar no Twitter"
          >
            <FaTwitter /> Twitter
          </ShareButton>
        )}

        {/* Mostrar botão do WhatsApp apenas se houver link configurado ou se não houver nenhum link personalizado */}
        {(hasWhatsapp || !hasAnySocialLink) && (
          <ShareButton
            onClick={() => handleShare('whatsapp')}
            aria-label="Compartilhar no WhatsApp"
          >
            <FaWhatsapp /> WhatsApp
          </ShareButton>
        )}

        {/* O botão de copiar link sempre estará disponível */}
        <CopyButton
          onClick={copyToClipboard}
          $copied={copied}
          aria-label="Copiar link"
        >
          {copied ? <FaCheck /> : <FaLink />}
          {copied ? 'Copiado!' : 'Copiar Link'}
        </CopyButton>
      </ShareButtons>

      {feedback && <ShareFeedback>{feedback}</ShareFeedback>}
    </ShareContainer>
  )
}