'use client'

import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`

export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => `${props.theme.colors.error}10`};
  border-radius: 4px;
`