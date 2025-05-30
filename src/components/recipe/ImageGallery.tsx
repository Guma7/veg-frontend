'use client'

import styled from 'styled-components'
import Image from 'next/image'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`

const ImageThumbnail = styled.div`
  position: relative;
  aspect-ratio: 1;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  
  &:hover {
    opacity: 0.9;
  }
`

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <GalleryContainer>
        {images.map((image, index) => (
          <ImageThumbnail key={index} onClick={() => setSelectedIndex(index)}>
            <Image
              src={image}
              alt={`Imagem ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </ImageThumbnail>
        ))}
      </GalleryContainer>

      {selectedIndex !== null && (
        <Modal onClick={() => setSelectedIndex(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <Image
              src={images[selectedIndex]}
              alt={`Imagem ${selectedIndex + 1}`}
              width={1200}
              height={800}
              style={{ objectFit: 'contain' }}
            />
            <NavButton
              style={{ left: 0 }}
              onClick={() => setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1)}
            >
              <FaChevronLeft />
            </NavButton>
            <NavButton
              style={{ right: 0 }}
              onClick={() => setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0)}
            >
              <FaChevronRight />
            </NavButton>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}