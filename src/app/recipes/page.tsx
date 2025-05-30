'use client'
import styled from 'styled-components'

const RecipesContainer = styled.div`
  padding: 6rem 2rem 2rem;
  min-height: 100vh;
`

export default function Recipes() {
  return (
    <RecipesContainer>
      <h1>Receitas</h1>
    </RecipesContainer>
  )
}