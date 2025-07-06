'use client'

import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { debounce } from 'lodash'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

export interface RecipeFiltersType {
  generalSearch: string
  title: string
  recipeClass: string
  genre: string
  style: string
  nutritionalLevel: string
  doesNotContain: string
  traditional: string
  ingredients: string[]
  search?: string
}

const FiltersContainer = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryGradientStart}, ${props => props.theme.colors.primaryGradientEnd});
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  color: white;
`;

const FilterGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`

const SearchRow = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
`

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
`

const FilterLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: 500;
  color: rgba(199, 198, 198, 0.9);
`

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid white;
  border-radius: ${props => props.theme.borderRadius.md};
  width: 100%;
  background-color: rgba(218, 218, 218, 0.9);
  
  & option:first-child {
    color: ${props => props.theme.colors.text.disabled};
    font-style: italic;
  }
`

const SelectLabel = styled.div`
  color: ${props => props.theme.colors.text.disabled};
  font-style: italic;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: 0.9em;
`

const StyledInput = styled(Input)`
  
  & input {
    background-color: rgba(223, 220, 220, 0.9);
    border: 1px solid white;
  }
`;

export function RecipeFilters({ onFilterChange }: { onFilterChange: (filters: RecipeFiltersType) => void }) {
  const [filters, setFilters] = useState<RecipeFiltersType>({
    generalSearch: '',
    title: '',
    recipeClass: '',
    genre: '',
    style: '',
    nutritionalLevel: '',
    doesNotContain: '',
    traditional: '',
    ingredients: []
  })
  const [genreSuggestions, setGenreSuggestions] = useState<string[]>([])

  // Debounce da função onFilterChange para evitar múltiplas requisições
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterChange = useCallback(
    debounce((newFilters: RecipeFiltersType) => {
      onFilterChange(newFilters)
    }, 500),
    [onFilterChange]
  )

  // Limpar o debounce quando o componente for desmontado
  useEffect(() => {
    return () => {
      debouncedFilterChange.cancel()
    }
  }, [debouncedFilterChange])

  const fetchGenreSuggestions = async (query: string) => {
    try {
      const response = await fetch(`${API_URL}/api/recipes/genres/suggest/?query=${query}`)
      if (response.ok) {
        const data = await response.json()
        setGenreSuggestions(data)
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
    }
  }

  const handleChange = (field: keyof RecipeFiltersType, value: string | string[]) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    
    // Usar debounce para campos de texto para evitar muitas requisições
    if (
      field === 'generalSearch' || 
      field === 'title' || 
      field === 'doesNotContain' || 
      field === 'traditional' ||
      field === 'ingredients'
    ) {
      debouncedFilterChange(newFilters)
    } else {
      // Para selects e outros campos, aplicar imediatamente
      onFilterChange(newFilters)
    }

    if (field === 'genre' && typeof value === 'string' && value.length >= 2) {
      fetchGenreSuggestions(value)
    }
  }

  return (
    <FiltersContainer>
      {/* Campo de pesquisa geral centralizado */}
      <SearchRow>
        <FilterLabel>Pesquisa Geral</FilterLabel>
        <StyledInput
          type="search"
          placeholder=""
          value={filters.generalSearch}
          onChange={(e) => handleChange('generalSearch', e.target.value)}
          fullwidth
        />
      </SearchRow>
      
      {/* Filtros organizados em 4 colunas com 2 opções cada */}
      <FilterRow>
        <div>
          <FilterLabel>Nome da Receita</FilterLabel>
          <StyledInput
            type="text"
            placeholder="Ex: Bolo de Cenoura..."
            value={filters.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullwidth
            style={{ fontSize: '0.8em' }}
          />
        </div>

        <div>
          <FilterLabel>Classe</FilterLabel>
          <Select
            value={filters.recipeClass}
            onChange={(e) => handleChange('recipeClass', e.target.value)}
            style={{ fontSize: '0.8em' }}
          >
            <option value="" hidden>Selecione</option>
            <option value="ENTRADA">Entrada</option>
            <option value="PRATO_PRINCIPAL">Prato Principal</option>
            <option value="SOBREMESA">Sobremesa</option>
            <option value="LANCHE">Lanche</option>
            <option value="ANIVERSARIO_VEGANO">Aniversário Vegano</option>
            <option value="SUCO">Suco</option>
            <option value="DRINK">Drink</option>
            <option value="VEG_FRIOS">Veg Frios</option>
            <option value="VEG_CARNES">Veg Carnes</option>
          </Select>
        </div>

        <div>
          <FilterLabel>Gênero</FilterLabel>
          <StyledInput
            placeholder="Ex: Pizza, Sushi..."
            value={filters.genre}
            onChange={(e) => {
              const value = e.target.value;
              handleChange('genre', value);
            }}
            list="genre-suggestions"
            fullwidth
            style={{ fontSize: '0.8em' }}
          />
          <datalist id="genre-suggestions">
            {genreSuggestions.map(suggestion => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div>
          <FilterLabel>Estilo</FilterLabel>
          <Select
            value={filters.style}
            onChange={(e) => handleChange('style', e.target.value)}
            style={{ fontSize: '0.8em' }}
          >
            <option value="" hidden>Selecione</option>
            <option value="GOURMET">Gourmet</option>
            <option value="CASEIRA">Caseira</option>
          </Select>
        </div>
      </FilterRow>
      
      <FilterRow>
        <div>
          <FilterLabel>Nível Nutricional</FilterLabel>
          <Select
            value={filters.nutritionalLevel}
            onChange={(e) => handleChange('nutritionalLevel', e.target.value)}
            style={{ fontSize: '0.8em' }}
          >
            <option value="" hidden>Selecione</option>
            <option value="BAIXO">Baixo</option>
            <option value="MEDIO">Médio</option>
            <option value="ALTO">Alto</option>
          </Select>
        </div>

        <div>
          <FilterLabel>Não Contém</FilterLabel>
          <StyledInput
            placeholder="Ex: Açúcar, Glúten..."
            value={filters.doesNotContain}
            onChange={(e) => handleChange('doesNotContain', e.target.value)}
            fullwidth
            style={{ fontSize: '0.8em' }}
          />
        </div>

        <div>
          <FilterLabel>Tradicional</FilterLabel>
          <StyledInput
            placeholder="Ex: Rio Grande do Sul..."
            value={filters.traditional}
            fullwidth
            onChange={(e) => handleChange('traditional', e.target.value)}
            style={{ fontSize: '0.8em' }}
          />
        </div>
        
        <div>
          <FilterLabel>Ingredientes</FilterLabel>
          <StyledInput
            placeholder="Ex: Soja, Cogumelo..."
            value={filters.ingredients.join(', ')}
            onChange={(e) => handleChange('ingredients', e.target.value.split(',').map(i => i.trim()))}
            style={{ fontSize: '0.8em' }}
            fullwidth
          />
        </div>
      </FilterRow>
    </FiltersContainer>
  )
}