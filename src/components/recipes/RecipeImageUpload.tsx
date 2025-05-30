'use client'
import styled from 'styled-components'
import Image from 'next/image'
import { useState, useRef } from 'react'

const UploadContainer = styled.div`
  width: 100%;
  height: 300px;
  border: 2px dashed ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const ImagePreview = styled.div<{ hasImage: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  display: ${props => props.hasImage ? 'block' : 'none'};
`

const UploadText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
`

interface RecipeImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
}

export default function RecipeImageUpload({ onImageSelect, currentImage }: RecipeImageUploadProps) {
  const [preview, setPreview] = useState(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    }
  }

  return (
    <UploadContainer onClick={handleClick}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <ImagePreview hasImage={!!preview}>
          <Image
            src={preview}
            alt="Preview da receita"
            fill
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
        </ImagePreview>
      ) : (
        <UploadText>
          <span>Clique para adicionar uma imagem</span>
          <span>ou arraste e solte aqui</span>
        </UploadText>
      )}
    </UploadContainer>
  )
}