'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const AvatarContainer = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: ${props => {
    switch (props.size) {
      case 'sm': return '32px'
      case 'lg': return '120px'
      default: return '48px'
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '32px'
      case 'lg': return '120px'
      default: return '48px'
    }
  }};
  border-radius: 50%;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background.paper};
  border: 2px solid ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  z-index: 2;
  position: relative;
  user-drag: none;
  -webkit-user-drag: none;
  pointer-events: none;
`;

const AvatarFallback = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '14px'
      case 'lg': return '24px'
      default: return '18px'
    }
  }};
  font-weight: 500;
`

interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg'
  fallback?: string
}

export function Avatar({ src, alt, size = 'md', fallback }: AvatarProps) {
  const defaultProfileImage = '/media/default/default_profile.svg';
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Adicionar timestamp para evitar cache da imagem
  useEffect(() => {
    if (src && typeof src === 'string' && src.trim() !== '') {
      const timestamp = new Date().getTime();
      // Adicionar timestamp apenas se não for uma URL de objeto (blob:)
      if (src.startsWith('blob:')) {
        setImageSrc(src);
      } else {
        // Verificar se a URL já tem parâmetros
        const hasParams = src.includes('?');
        const newUrl = `${src}${hasParams ? '&' : '?'}t=${timestamp}`;
        setImageSrc(newUrl);
      }
    } else {
      setImageSrc(null);
    }
    setImageError(false);
  }, [src]);
  
  return (
    <AvatarContainer size={size}>
      {!imageSrc || imageError ? (
        <AvatarImage 
          src={defaultProfileImage} 
          alt={alt} 
          draggable={false}
        />
      ) : (
        <AvatarImage 
          key={imageSrc} // Forçar remontagem quando a URL mudar
          src={imageSrc} 
          alt={alt} 
          draggable={false}
          onError={() => {
            console.error('Erro ao carregar imagem:', imageSrc);
            setImageError(true);
          }} 
        />
      )}
    </AvatarContainer>
  );
}
