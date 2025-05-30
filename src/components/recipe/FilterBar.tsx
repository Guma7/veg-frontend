'use client'
import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Input } from '../ui/Input'
import { debounce } from 'lodash'
import { Select } from '../ui/Select'

const FilterContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    recipe_class: '',
    genre: '',
    style: '',
    nutritional_level: '',
    does_not_contain: '',
    traditional: '',
    ingredients: ''
  })

  const debouncedOnChange = useCallback(
    debounce((newFilters: FilterValues) => {
      onFilterChange(newFilters)
    }, 300),
    []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newFilters = {
      ...filters,
      [name]: value
    }
    setFilters(newFilters)
    debouncedOnChange(newFilters)
  }

  return (
    <FilterContainer>
      <FilterGrid>
        <Input
          name="search"
          placeholder="Buscar receitas..."
          value={filters.search}
          onChange={handleChange}
        />
        <Select
          name="recipe_class"
          value={filters.recipe_class}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todas as classes' },
            { value: 'ENTRADA', label: 'Entrada' },
            { value: 'PRATO_PRINCIPAL', label: 'Prato Principal' },
            { value: 'SOBREMESA', label: 'Sobremesa' },
            { value: 'LANCHE', label: 'Lanche' },
            { value: 'ANIVERSARIO_VEGANO', label: 'Aniversário Vegano' },
            { value: 'SUCO', label: 'Suco' },
            { value: 'DRINK', label: 'Drink' },
            { value: 'VEG_FRIOS', label: 'Veg Frios' },
            { value: 'VEG_CARNES', label: 'Veg Carnes' }
          ]}
        />
        <Input
          name="genre"
          placeholder="Gênero (ex: Pizza, Salada...)"
          value={filters.genre}
          onChange={handleChange}
        />
        <Select
          name="style"
          value={filters.style}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todos os estilos' },
            { value: 'GOURMET', label: 'Gourmet' },
            { value: 'CASEIRA', label: 'Caseira' }
          ]}
        />
        <Select
          name="nutritional_level"
          value={filters.nutritional_level}
          onChange={handleChange}
          options={[
            { value: '', label: 'Nível Nutricional' },
            { value: 'BAIXO', label: 'Baixo' },
            { value: 'MEDIO', label: 'Médio' },
            { value: 'ALTO', label: 'Alto' }
          ]}
        />
        <Input
          name="does_not_contain"
          placeholder="Não contém (ex: Açúcar, Glúten...)"
          value={filters.does_not_contain}
          onChange={handleChange}
        />
        <Input
          name="traditional"
          placeholder="Tradicional (ex: Rio Grande do Sul, Japão...)"
          value={filters.traditional}
          onChange={handleChange}
        />
        <Input
          name="ingredients"
          placeholder="Ingredientes (ex: Tomate, Manjericão...)"
          value={filters.ingredients}
          onChange={handleChange}
        />
      </FilterGrid>
    </FilterContainer>
  )
}


interface FilterValues {
  search: string;
  recipe_class: string;
  genre: string;
  style: string;
  nutritional_level: string;
  does_not_contain: string;
  traditional: string;
  ingredients: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
}