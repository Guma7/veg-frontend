'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background.paper};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.md};
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`

const SuggestionItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.background.hover};
  }
`

interface TagSuggestionsProps {
  query: string;
  onSelect: (tag: string) => void;
}

export function TagSuggestions({ query, onSelect }: TagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) return setSuggestions([])

      try {
        const response = await fetch(`${API_URL}/api/tags/suggest/?q=${query}`, {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error)
      }
    }

    fetchSuggestions()
  }, [query])

  if (!suggestions.length) return null

  return (
    <SuggestionsContainer>
      {suggestions.map((tag, index) => (
        <SuggestionItem
          key={index}
          onClick={() => onSelect(tag)}
        >
          {tag}
        </SuggestionItem>
      ))}
    </SuggestionsContainer>
  )
}