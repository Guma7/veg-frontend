'use client'

import styled from 'styled-components'
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink } from 'react-icons/fa'

const ShareContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;
`

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

const FacebookButton = styled(ShareButton)`
  background: #1877f2;
  color: white;
`

const TwitterButton = styled(ShareButton)`
  background: #1da1f2;
  color: white;
`

const WhatsappButton = styled(ShareButton)`
  background: #25d366;
  color: white;
`

const CopyButton = styled(ShareButton)`
  background: ${props => props.theme.colors.background.hover};
  color: ${props => props.theme.colors.text.primary};
`

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)
        break
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <ShareContainer>
      <FacebookButton onClick={() => handleShare('facebook')}>
        <FaFacebook /> Compartilhar
      </FacebookButton>
      <TwitterButton onClick={() => handleShare('twitter')}>
        <FaTwitter /> Tweet
      </TwitterButton>
      <WhatsappButton onClick={() => handleShare('whatsapp')}>
        <FaWhatsapp /> WhatsApp
      </WhatsappButton>
      <CopyButton onClick={() => handleShare('copy')}>
        <FaLink /> Copiar Link
      </CopyButton>
    </ShareContainer>
  )
}