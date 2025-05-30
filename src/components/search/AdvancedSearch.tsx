'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'

const SearchContainer = styled.div`
  background: ${props => props.theme.colors.background.paper};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const SearchGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const FilterLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`

interface SearchFilters {
  search: string;
  recipeClass: string;
  genre: string;
  style: string;
  nutritionalLevel: string;
  doesNotContain: string;
  traditional: string;
  ingredients: string;
}

export function AdvancedSearch({ onSearch }: { onSearch: (filters: SearchFilters) => void }) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    recipeClass: '',
    genre: '',
    style: '',
    nutritionalLevel: '',
    doesNotContain: '',
    traditional: '',
    ingredients: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchGroup>
          <FilterLabel>Nome da Receita</FilterLabel>
          <Input
            placeholder="Ex: Bolo de Cenoura, Risoto..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
        </SearchGroup>

        <SearchGroup>
          <FilterLabel>Classe</FilterLabel>
          <Select
            options={[
              { value: "", label: "Selecione uma classe" },
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
            value={filters.recipeClass}
            onChange={e => setFilters({ ...filters, recipeClass: e.target.value })}
          />
        </SearchGroup>

        <SearchGroup>
          <FilterLabel>Gênero</FilterLabel>
          <Input
            placeholder="Ex: Pizza, Salada..."
            value={filters.genre}
            onChange={e => setFilters({ ...filters, genre: e.target.value })}
          />
        </SearchGroup>

        <SearchGroup>
          <FilterLabel>Estilo</FilterLabel>
          <Select
            options={[
              { value: "", label: "Selecione um estilo" },
              { value: "GOURMET", label: "Gourmet" },
              { value: "CASEIRA", label: "Caseira" }
            ]}
            value={filters.style}
            onChange={e => setFilters({ ...filters, style: e.target.value })}
          />
        </SearchGroup>

        <SearchGroup>
          <FilterLabel>Nível Nutricional</FilterLabel>
          <Select
            options={[
              { value: "", label: "Selecione um nível" },
              { value: "BAIXO", label: "Baixo" },
              { value: "MEDIO", label: "Médio" },
              { value: "ALTO", label: "Alto" }
            ]}
            value={filters.nutritionalLevel}
            onChange={e => setFilters({ ...filters, nutritionalLevel: e.target.value })}
          />
        </SearchGroup>

        <SearchGroup>
          <FilterLabel>Não Contém</FilterLabel>
          <Input
            placeholder="Ex: Açúcar, Glúten..."
            value={filters.doesNotContain}
            onChange={e => setFilters({ ...filters, doesNotContain: e.target.value })}
          />
        </SearchGroup>

        <SearchGroup>
          <FilterLabel>Tradicional</FilterLabel>
          <Input
            placeholder="Ex: Rio Grande do Sul, Japão..."
            value={filters.traditional}
            onChange={e => setFilters({ ...filters, traditional: e.target.value })}
          />
        </SearchGroup>

        <SearchGroup>
          <FilterLabel>Ingredientes</FilterLabel>
          <Input
            placeholder="Ex: Tomate, Manjericão..."
            value={filters.ingredients}
            onChange={e => setFilters({ ...filters, ingredients: e.target.value })}
          />
        </SearchGroup>

        <Button type="submit">Buscar</Button>
      </SearchForm>
    </SearchContainer>
  )
}