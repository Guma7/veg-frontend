'use client'

import styled from 'styled-components'
import { RecipeCard } from './RecipeCard'
import { SearchResult } from '../../utils/search'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const SectionTitle = styled.h2`
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text.primary};
`

interface Recipe {
  id: number
  title: string
  image: string
  rating: number
}

interface RecipeGridProps {
  results?: SearchResult;
  recipes?: Recipe[];
}

export function RecipeGrid({ results, recipes }: RecipeGridProps) {
  if (results) {
    if (!results.exact.length && !results.similar.length) {
      return <p>Nenhuma receita encontrada</p>
    }
  }

  return (
    <>
      {results ? (
        <>
          {results.exact.length > 0 && (
            <Section>
              <Grid>
                {results.exact.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </Grid>
            </Section>
          )}

          {results.similar.length > 0 && (
            <Section>
              <SectionTitle>Receitas Similares</SectionTitle>
              <Grid>
                {results.similar.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </Grid>
            </Section>
          )}
        </>
      ) : recipes ? (
        <Grid>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </Grid>
      ) : (
        <p>Nenhuma receita encontrada</p>
      )}
    </>
  )
}