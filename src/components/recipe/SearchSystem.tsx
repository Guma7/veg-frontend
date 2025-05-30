'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`

const FilterGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: white;
`

interface SearchFilters {
  search: string;
  recipeClass: string;
  style: string;
  genre: string;
  nutritionalLevel: string;
  doesNotContain: string;
  traditional: string;
  ingredients: string[];
}

export function SearchSystem({ onSearch }: { onSearch: (filters: SearchFilters) => void }) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    recipeClass: '',
    style: '',
    genre: '',
    nutritionalLevel: '',
    doesNotContain: '',
    traditional: '',
    ingredients: []
  })

  return (
    <SearchContainer>
      <Input
        placeholder="Buscar receitas..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      <FilterGroup>
        <Select
          value={filters.recipeClass}
          onChange={(e) => setFilters({ ...filters, recipeClass: e.target.value })}
        >
          <option value="">Classe</option>
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
        <Select
          value={filters.style}
          onChange={(e) => setFilters({ ...filters, style: e.target.value })}
        >
          <option value="">Estilo</option>
          <option value="GOURMET">Gourmet</option>
          <option value="CASEIRA">Caseira</option>
        </Select>
        <Input
          placeholder="Gênero (ex: Pizza, Salada...)"
          value={filters.genre}
          onChange={e => setFilters({ ...filters, genre: e.target.value })}
        />
        <Select
          value={filters.nutritionalLevel}
          onChange={e => setFilters({ ...filters, nutritionalLevel: e.target.value })}
        >
          <option value="">Nível Nutricional</option>
          <option value="BAIXO">Baixo</option>
          <option value="MEDIO">Médio</option>
          <option value="ALTO">Alto</option>
        </Select>
        <Input
          placeholder="Não contém (ex: Açúcar, Glúten...)"
          value={filters.doesNotContain}
          onChange={e => setFilters({ ...filters, doesNotContain: e.target.value })}
        />
        <Input
          placeholder="Tradicional (ex: Rio Grande do Sul)"
          value={filters.traditional}
          onChange={e => setFilters({ ...filters, traditional: e.target.value })}
        />
        <Input
          placeholder="Ingredientes (separados por vírgula)"
          value={filters.ingredients.join(', ')}
          onChange={e => setFilters({ ...filters, ingredients: e.target.value.split(',').map(i => i.trim()) })}
        />
      </FilterGroup>
      <Button onClick={() => onSearch(filters)}>Buscar</Button>
    </SearchContainer>
  )
}