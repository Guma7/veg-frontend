'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { 
  FaShareAlt, 
  FaFacebook, 
  FaTwitter, 
  FaWhatsapp, 
  FaPinterest,
  FaEnvelope,
  FaLink,
  FaQrcode
} from 'react-icons/fa'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

const ShareContainer = styled.div`
  position: relative;
`

const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.xl};
`

const ShareButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  
  svg {
    font-size: 24px;
  }
`

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.xl};
  background: white;
`

interface ShareOptionsProps {
  url: string;
  title: string;
  image?: string;
  description?: string;
}

export function ShareOptions({ url, title, image, description }: ShareOptionsProps) {
  const [showQRCode, setShowQRCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDesc = encodeURIComponent(description || '')

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
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${image}&description=${encodedDesc}`)
        break
      case 'email':
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedDesc}%20${encodedUrl}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  return (
    <ShareContainer>
      <ShareGrid>
        <ShareButton onClick={() => handleShare('facebook')}>
          <FaFacebook />
          Facebook
        </ShareButton>
        
        <ShareButton onClick={() => handleShare('twitter')}>
          <FaTwitter />
          Twitter
        </ShareButton>
        
        <ShareButton onClick={() => handleShare('whatsapp')}>
          <FaWhatsapp />
          WhatsApp
        </ShareButton>
        
        <ShareButton onClick={() => handleShare('pinterest')}>
          <FaPinterest />
          Pinterest
        </ShareButton>
        
        <ShareButton onClick={() => handleShare('email')}>
          <FaEnvelope />
          Email
        </ShareButton>
        
        <ShareButton onClick={() => handleShare('copy')}>
          <FaLink />
          {copied ? 'Copiado!' : 'Copiar Link'}
        </ShareButton>
        
        <ShareButton onClick={() => setShowQRCode(true)}>
          <FaQrcode />
          QR Code
        </ShareButton>
      </ShareGrid>

      <Modal isOpen={showQRCode} onClose={() => setShowQRCode(false)}>
        <QRCodeContainer>
          <h3>QR Code da Receita</h3>
          <QRCode value={url} size={200} />
          <p>Escaneie para acessar a receita</p>
        </QRCodeContainer>
      </Modal>
    </ShareContainer>
  )
}