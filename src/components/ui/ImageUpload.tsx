'use client'
import { useState, useRef } from 'react'
import styled from 'styled-components'
import { Button } from './Button'

const ImagePreview = styled.div<{ hasImage: boolean; imageUrl?: string }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px dashed ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
`

const HiddenInput = styled.input`
  display: none;
`

interface ImageUploadProps {
  currentImage?: string;
  onImageSelect: (file: File) => void;
}

export default function ImageUpload({ currentImage, onImageSelect }: ImageUploadProps) {
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
    <div>
      <ImagePreview hasImage={!!preview} imageUrl={preview} onClick={handleClick}>
        {!preview && 'Selecionar Imagem'}
      </ImagePreview>
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  )
}