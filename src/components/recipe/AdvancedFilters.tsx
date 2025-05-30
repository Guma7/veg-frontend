'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { FaFilter, FaSearch, FaClock, FaUtensils } from 'react-icons/fa'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

const FiltersWrapper = styled.div`
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`

const Tag = styled.button<{ $active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  border: 1px solid ${props => props.theme.colors.primary};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.background.hover};
  }
`

interface FilterOptions {
  search: string;
  recipeClass: string;
  genre: string;
  prepTime: string;
  difficulty: string;
  tags: string[];
}

export function AdvancedFilters({ onFilterChange }: { onFilterChange: (filters: FilterOptions) => void }) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    recipeClass: '',
    genre: '',
    prepTime: '',
    difficulty: '',
    tags: []
  })

  const commonTags = ['Sem Glúten', 'Baixa Caloria', 'Proteico', 'Rápido', 'Fácil']

  const handleTagToggle = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
      
      const newFilters = { ...prev, tags: newTags }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  return (
    <FiltersWrapper>
      <FilterGrid>
        <FilterGroup>
          <Input
            icon={<FaSearch />}
            placeholder="Buscar receitas..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <Select
            value={filters.recipeClass}
            onChange={e => handleFilterChange('recipeClass', e.target.value)}
            options={[
              { value: "", label: "Classe da Receita" },
              { value: "ENTRADA", label: "Entrada" },
              { value: "PRATO_PRINCIPAL", label: "Prato Principal" },
              { value: "SOBREMESA", label: "Sobremesa" },
              { value: "LANCHE", label: "Lanche" },
              { value: "ANIVERSARIO_VEGANO", label: "Aniversário Vegano" },
              { value: "SUCO", label: "Suco" },
              { value: "DRINK", label: "Drink" },
              { value: "VEG_FRIOS", label: "Veg Frios" },
              { value: "VEG_CARNES", label: "Veg Carnes" }
            ]}
          />
        </FilterGroup>

        <FilterGroup>
          <Select
            value={filters.genre}
            onChange={e => handleFilterChange('genre', e.target.value)}
            options={[
              { value: "", label: "Gênero" },
              { value: "entrada", label: "Entrada" },
              { value: "principal", label: "Prato Principal" },
              { value: "sobremesa", label: "Sobremesa" }
            ]}
          />
        </FilterGroup>

        <FilterGroup>
          <Select
            value={filters.prepTime}
            onChange={e => handleFilterChange('prepTime', e.target.value)}
            options={[
              { value: "", label: "Tempo de Preparo" },
              { value: "rapido", label: "Até 30 min" },
              { value: "medio", label: "30-60 min" },
              { value: "longo", label: "Mais de 60 min" }
            ]}
          />
        </FilterGroup>
      </FilterGrid>

      <TagsContainer>
        {commonTags.map(tag => (
          <Tag
            key={tag}
            $active={filters.tags.includes(tag)}
            onClick={() => handleTagToggle(tag)}
          >
            {tag}
          </Tag>
        ))}
      </TagsContainer>
    </FiltersWrapper>
  )
}