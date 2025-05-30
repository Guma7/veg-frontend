'use client'

import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin: ${props => props.theme.spacing.md} 0;
`

const PreviewContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: ${props => props.theme.borderRadius.md};

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
`

interface YouTubePreviewProps {
  value: string
  onChange: (value: string) => void
}

export function YouTubePreview({ value, onChange }: YouTubePreviewProps) {
  const [error, setError] = useState('')

  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1)
      }
      return urlObj.searchParams.get('v')
    } catch {
      return null
    }
  }

  const handleChange = (url: string) => {
    const videoId = getVideoId(url)
    if (url && !videoId) {
      setError('URL do YouTube inválida')
    } else {
      setError('')
    }
    onChange(url)
  }

  const videoId = getVideoId(value)

  return (
    <Container>
      <Input
        type="url"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Cole aqui o link do YouTube"
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
      {videoId && (
        <PreviewContainer>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </PreviewContainer>
      )}
    </Container>
  )
}