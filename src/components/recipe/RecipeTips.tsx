'use client'

import styled from 'styled-components'
import { FaLightbulb, FaInfoCircle } from 'react-icons/fa'

const TipsContainer = styled.div`
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin: ${props => props.theme.spacing.xl} 0;
`

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fonts.sizes.lg};
`

const TipList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const TipItem = styled.li`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.hover};
  border-radius: ${props => props.theme.borderRadius.md};
`

interface RecipeTipsProps {
  tips: string[];
  substitutions?: { ingredient: string; alternatives: string[] }[];
}

export function RecipeTips({ tips, substitutions }: RecipeTipsProps) {
  return (
    <TipsContainer>
      <TipHeader>
        <FaLightbulb />
        <h3>Dicas e Sugestões</h3>
      </TipHeader>

      <TipList>
        {tips.map((tip, index) => (
          <TipItem key={index}>
            <FaInfoCircle color="#4CAF50" />
            <span>{tip}</span>
          </TipItem>
        ))}
      </TipList>

      {substitutions && substitutions.length > 0 && (
        <>
          <TipHeader style={{ marginTop: '2rem' }}>
            <FaLightbulb />
            <h3>Substituições Possíveis</h3>
          </TipHeader>

          <TipList>
            {substitutions.map((sub, index) => (
              <TipItem key={index}>
                <FaInfoCircle color="#4CAF50" />
                <div>
                  <strong>{sub.ingredient}:</strong>
                  <p>{sub.alternatives.join(', ')}</p>
                </div>
              </TipItem>
            ))}
          </TipList>
        </>
      )}
    </TipsContainer>
  )
}