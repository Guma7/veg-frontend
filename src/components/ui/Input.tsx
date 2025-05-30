import styled, { css } from 'styled-components'
import { ReactNode } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  fullwidth?: boolean
  icon?: ReactNode
  className?: string
}

const InputWrapper = styled.div<{ $fullwidth?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  ${props => props.$fullwidth && css`
    width: 100%;
  `}
`

const IconWrapper = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`

const StyledInput = styled.input<Omit<InputProps, 'fullwidth' | 'icon'> & { $fullwidth?: boolean; $icon?: ReactNode }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  font-size: ${props => props.theme.fonts.sizes.md};
  transition: all 0.2s;
  
  ${props => props.$fullwidth && css`
    width: 100%;
  `}

  ${props => props.$icon ? css`
    padding-left: ${props.theme.spacing.xl};
  ` : ''}

  &:focus {
    outline: none;
    border-color: ${props => props.error ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.error ? props.theme.colors.error : props.theme.colors.primary}33;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.disabled};
  }

  &:disabled {
    background: ${props => props.theme.colors.background.default};
    cursor: not-allowed;
  }
`

export function Input({ icon, fullwidth, className, ...props }: InputProps) {
  const domProps = { ...props };
  // Remove fullWidth from DOM props to avoid React warning
  delete (domProps as any).fullWidth;
  
  return (
    <InputWrapper $fullwidth={fullwidth} className={className}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <StyledInput 
        {...domProps}
        $icon={icon} 
        $fullwidth={fullwidth}
      />
    </InputWrapper>
  )
}