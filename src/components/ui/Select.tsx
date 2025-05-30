'use client'
import styled from 'styled-components'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  $fullWidth?: boolean
  options: Array<{
    value: string
    label: string
  }>
}

const StyledSelect = styled.select<{ $fullWidth?: boolean }>`
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: inherit;
  font-size: ${props => props.theme.fonts.sizes.md};
  background-color: ${props => props.theme.colors.background.default};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Select = ({ 
  options, 
  $fullWidth,
  ...rest 
}: SelectProps) => {
  return (
    <StyledSelect $fullWidth={$fullWidth} {...rest}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  )
}