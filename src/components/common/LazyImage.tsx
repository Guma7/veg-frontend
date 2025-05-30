'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styled from 'styled-components'

const ImageWrapper = styled.div<{ aspectRatio?: number }>`
  position: relative;
  width: 100%;
  padding-bottom: ${props => props.aspectRatio ? `${100 / props.aspectRatio}%` : '75%'};
`

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.background.lighter};
  display: flex;
  align-items: center;
  justify-content: center;
`

interface LazyImageProps {
  src: string
  alt: string
  aspectRatio?: number
  priority?: boolean
  className?: string
}

export function LazyImage({ src, alt, aspectRatio = 4/3, priority = false, className }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <ImageWrapper aspectRatio={aspectRatio} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={80}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        style={{
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s'
        }}
      />
      {isLoading && !error && (
        <Placeholder>
          Carregando...
        </Placeholder>
      )}
      {error && (
        <Placeholder>
          Erro ao carregar imagem
        </Placeholder>
      )}
    </ImageWrapper>
  )
}