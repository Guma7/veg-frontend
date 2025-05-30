'use client'
import styled from 'styled-components'

interface ContainerProps {
  fluid?: boolean
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: ${props => props.theme.spacing.md};
  padding-left: ${props => props.theme.spacing.md};
  max-width: ${props => props.fluid ? '100%' : props.theme.breakpoints.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.xl}) {
    max-width: ${props => props.theme.breakpoints.lg};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    max-width: ${props => props.theme.breakpoints.md};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    max-width: 100%;
  }
`