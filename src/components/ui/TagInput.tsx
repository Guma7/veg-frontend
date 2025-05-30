'use client'

import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
`

const Tag = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`

const Input = styled.input`
  border: none;
  outline: none;
  padding: ${props => props.theme.spacing.xs};
  min-width: 120px;
  flex-grow: 1;
`

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${props => props.theme.spacing.xs} 0 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  max-height: 200px;
  overflow-y: auto;
`

const SuggestionItem = styled.li`
  padding: ${props => props.theme.spacing.sm};
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.background.hover};
  }
`

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  maxLength?: number
  placeholder?: string
}

export function TagInput({ tags, onChange, suggestions = [], maxLength = 14, placeholder = "Adicionar tag..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Usando useRef para armazenar o valor anterior e evitar atualizações desnecessárias
  const prevFilteredRef = useRef<string[]>([]);
  
  useEffect(() => {
    const filtered = suggestions.filter(
      suggestion => 
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(suggestion)
    )
    
    // Comparar arrays para evitar atualizações desnecessárias
    const prevFiltered = prevFilteredRef.current;
    const isEqual = filtered.length === prevFiltered.length && 
      filtered.every((item, index) => item === prevFiltered[index]);
    
    if (!isEqual) {
      setFilteredSuggestions(filtered);
      prevFilteredRef.current = filtered;
    }
  }, [inputValue, suggestions, tags])

  const handleInputChange = (value: string) => {
    if (value.length <= maxLength) {
      setInputValue(value)
      setShowSuggestions(true)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <Container ref={containerRef}>
      <TagsContainer>
        {tags.map(tag => (
          <Tag key={tag}>
            {tag}
            <button onClick={() => removeTag(tag)}>&times;</button>
          </Tag>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </TagsContainer>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <SuggestionsList>
          {filteredSuggestions.map(suggestion => (
            <SuggestionItem
              key={suggestion}
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </Container>
  )
}