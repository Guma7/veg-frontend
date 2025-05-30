'use client'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
`

const Title = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fonts.sizes.xl};
  margin-bottom: ${props => props.theme.spacing.md};
`

const Message = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.md};
  max-width: 500px;
`

interface NoResultsProps {
  title?: string
  message?: string
}

export const NoResults = ({ 
  title = "Nenhum resultado encontrado", 
  message = "Tente ajustar seus filtros ou fazer uma nova busca." 
}: NoResultsProps) => (
  <Container>
    <Title>{title}</Title>
    <Message>{message}</Message>
  </Container>
)