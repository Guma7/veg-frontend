'use client'

import styled from 'styled-components'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { FaTrash } from 'react-icons/fa'

const Container = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`

interface Ingredient {
  name: string
  quantity: string
  unit: string
}

interface IngredientInputProps {
  ingredient: Ingredient
  onChange: (ingredient: Ingredient) => void
  onRemove: () => void
}

export function IngredientInput({ ingredient, onChange, onRemove }: IngredientInputProps) {
  return (
    <Container>
      <Input
        placeholder="Nome"
        value={ingredient.name}
        onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Quantidade"
        value={ingredient.quantity}
        onChange={(e) => onChange({ ...ingredient, quantity: e.target.value })}
        style={{ width: '100px' }}
      />
      <Input
        placeholder="Unidade"
        value={ingredient.unit}
        onChange={(e) => onChange({ ...ingredient, unit: e.target.value })}
        style={{ width: '100px' }}
      />
      <Button $variant="outline" onClick={onRemove}>
        <FaTrash />
      </Button>
    </Container>
  )
}