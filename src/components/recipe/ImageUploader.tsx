import { useState, useRef } from 'react'
import styled from 'styled-components'

const UploaderContainer = styled.div`
  margin-bottom: 2rem;
`

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const ImagePreview = styled.div<{ $isPrimary?: boolean }>`
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

const Controls = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 8px;
`

interface Props {
  onChange: (files: File[], primaryIndex: number) => void
}

export default function ImageUploader({ onChange }: Props) {
  const [previews, setPreviews] = useState<string[]>([])
  const [primaryIndex, setPrimaryIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)
    
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
    onChange(selectedFiles, primaryIndex)
  }

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    setFiles(newFiles)
    setPreviews(newPreviews)
    if (primaryIndex === index) {
      setPrimaryIndex(0)
    }
    onChange(newFiles, primaryIndex === index ? 0 : primaryIndex)
  }

  const setPrimary = (index: number) => {
    setPrimaryIndex(index)
    onChange(files, index)
  }

  return (
    <UploaderContainer>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <button onClick={() => fileInputRef.current?.click()}>
        Adicionar Imagens
      </button>

      <ImageGrid>
        {previews.map((preview, index) => (
          <ImagePreview key={preview} $isPrimary={index === primaryIndex}>
            <img src={preview} alt={`Preview ${index + 1}`} />
            <Controls>
              <button onClick={() => setPrimary(index)}>
                {index === primaryIndex ? '★' : '☆'}
              </button>
              <button onClick={() => removeImage(index)}>×</button>
            </Controls>
          </ImagePreview>
        ))}
      </ImageGrid>
    </UploaderContainer>
  )
}