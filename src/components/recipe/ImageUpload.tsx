'use client'

import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ErrorMessage } from '../ui/ErrorMessage'

const UploadContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`

const Preview = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: ${props => props.theme.borderRadius.md};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
`

interface ImageUploadProps {
  initialImages: File[]
  initialPrimaryIndex: number
  onImagesChange: (files: File[], primaryIndex: number) => void
  error?: string
  maxFiles?: number
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function ImageUpload({
  initialImages = [],
  initialPrimaryIndex = 0,
  onImagesChange,
  error,
  maxFiles = 5
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const [primaryIndex, setPrimaryIndex] = useState(initialPrimaryIndex)
  const [uploadError, setUploadError] = useState(error)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar previews iniciais
  useEffect(() => {
    const newPreviews = initialImages.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
    return () => newPreviews.forEach(URL.revokeObjectURL)
  }, [initialImages])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Formato não suportado. Use JPEG, PNG ou WebP.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Arquivo muito grande. Máximo de 5MB.'
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    if (newFiles.length + previews.length > maxFiles) {
      setUploadError(`Máximo de ${maxFiles} imagens permitidas`)
      return
    }
    const validFiles: File[] = []
    newFiles.forEach(file => {
      const error = validateFile(file)
      if (error) {
        setUploadError(error)
      } else {
        validFiles.push(file)
      }
    })
    if (validFiles.length === 0) return
    const updatedFiles = [...initialImages, ...validFiles]
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
    setUploadError('')
    onImagesChange(updatedFiles, primaryIndex)
  }

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    const updatedFiles = [...initialImages]
    updatedFiles.splice(index, 1)
    const updatedPreviews = [...previews]
    updatedPreviews.splice(index, 1)
    setPreviews(updatedPreviews)
    onImagesChange(updatedFiles, primaryIndex)
  }

  const setAsPrimary = (index: number) => {
    setPrimaryIndex(index)
    onImagesChange(initialImages, index)
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={ALLOWED_TYPES.join(',')}
        multiple
        style={{ display: 'none' }}
      />
      <UploadContainer onClick={() => fileInputRef.current?.click()}>
        {previews.length === 0 && (
          <span>Clique ou arraste para adicionar imagens</span>
        )}
        {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}
      </UploadContainer>
      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {previews.map((preview, index) => (
            <Preview key={index}>
              <img src={preview} alt={`Preview ${index}`} />
              <RemoveButton onClick={() => handleRemoveImage(index)}>
                &times;
              </RemoveButton>
              <button
                onClick={() => setAsPrimary(index)}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: index === primaryIndex ? 'green' : 'gray',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {index === primaryIndex ? 'Principal' : 'Tornar principal'}
              </button>
            </Preview>
          ))}
        </div>
      )}
    </div>
  )
}