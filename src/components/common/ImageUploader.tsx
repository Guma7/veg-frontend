import { useState } from 'react'
import styled from 'styled-components'
import { ImageUploaderProps } from '../../types/props'

interface ImageGridProps {
  $isEmpty: boolean
}

const UploadContainer = styled.div`
  margin-bottom: 1.5rem;
`

const ImageGrid = styled.div<ImageGridProps>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding: ${props => props.$isEmpty ? '2rem' : '0'};
  border: ${props => props.$isEmpty ? '2px dashed #ccc' : 'none'};
  border-radius: 8px;
`

interface ImagePreviewProps {
  $isPrimary: boolean
}

const ImagePreview = styled.div<ImagePreviewProps>`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${props => props.$isPrimary ? props.theme.colors.primary : 'transparent'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
`

const PrimaryButton = styled.button`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
`

export default function ImageUploader({ onChange, maxFiles = 5 }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [primaryIndex, setPrimaryIndex] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} imagens permitido`)
      return
    }
    
    setFiles(prev => [...prev, ...selectedFiles])
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
    onChange([...files, ...selectedFiles], primaryIndex)
  }

  const handleDelete = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    if (primaryIndex === index) {
      setPrimaryIndex(0)
    } else if (primaryIndex > index) {
      setPrimaryIndex(prev => prev - 1)
    }

    setFiles(newFiles)
    setPreviews(newPreviews)
    onChange(newFiles, primaryIndex)
  }

  const setPrimary = (index: number) => {
    setPrimaryIndex(index)
    onChange(files, index)
  }

  return (
    <UploadContainer>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="image-upload"
      />
      
      <ImageGrid $isEmpty={previews.length === 0}>
        {previews.map((preview, index) => (
          <ImagePreview key={preview} $isPrimary={index === primaryIndex}>
            <img src={preview} alt={`Preview ${index + 1}`} />
            <DeleteButton onClick={() => handleDelete(index)}>×</DeleteButton>
            {index !== primaryIndex && (
              <PrimaryButton onClick={() => setPrimary(index)}>
                Principal
              </PrimaryButton>
            )}
          </ImagePreview>
        ))}
        
        {previews.length < maxFiles && (
          <label htmlFor="image-upload">
            <div style={{ cursor: 'pointer', textAlign: 'center' }}>
              + Adicionar Imagem
            </div>
          </label>
        )}
      </ImageGrid>
    </UploadContainer>
  )
}