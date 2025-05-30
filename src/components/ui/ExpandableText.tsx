'use client'

import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
`

const Content = styled.div<{ isExpanded: boolean; maxHeight: number }>`
  overflow: hidden;
  max-height: ${props => props.isExpanded ? 'none' : `${props.maxHeight}px`};
  transition: max-height 0.3s ease-out;
`

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.xs};

  &:hover {
    text-decoration: underline;
  }
`

interface ExpandableTextProps {
  text: string
  maxHeight?: number
  className?: string
}

export function ExpandableText({ text, maxHeight = 100, className }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowButton, setShouldShowButton] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setShouldShowButton(contentRef.current.scrollHeight > maxHeight)
    }
  }, [text, maxHeight])

  return (
    <Container className={className}>
      <Content
        ref={contentRef}
        isExpanded={isExpanded}
        maxHeight={maxHeight}
      >
        {text}
      </Content>
      {shouldShowButton && (
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Ver menos' : 'Ver mais'}
        </ToggleButton>
      )}
    </Container>
  )
}