import styled from 'styled-components'

export const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fonts.sizes.sm};
  margin-top: ${props => props.theme.spacing.xs};
`