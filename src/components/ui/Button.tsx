'use client'

import styled, { css, keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-right: ${props => props.theme.spacing.sm};
`

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullwidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

const StyledButton = styled.button<Omit<ButtonProps, 'fullwidth'> & { $fullwidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.fonts.sizes.md};
  font-weight: 500;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  
  ${props => props.size === 'sm' && css`
    padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
    font-size: ${props.theme.fonts.sizes.sm};
    border-radius: ${props.theme.borderRadius.sm};
  `}
  
  ${props => (!props.size || props.size === 'md') && css`
    padding: ${props.theme.spacing.sm} ${props.theme.spacing.lg};
    font-size: ${props.theme.fonts.sizes.md};
    border-radius: ${props.theme.borderRadius.md};
  `}
  
  ${props => props.size === 'lg' && css`
    padding: ${props.theme.spacing.md} ${props.theme.spacing.xl};
    font-size: ${props.theme.fonts.sizes.lg};
    border-radius: ${props.theme.borderRadius.lg};
  `}

  ${props => props.$fullwidth && css`
    width: 100%;
  `}

  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}

  ${props => {
    switch (props.$variant) {
      case 'secondary':
        return css`
          background: ${props.theme.colors.secondary};
          color: ${props.theme.colors.text.inverse};
          &:hover:not(:disabled) { 
            background: ${props.theme.colors.primaryLight};
            transform: translateY(-1px);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'outline':
        return css`
          background: transparent;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          &:hover:not(:disabled) { 
            background: ${props.theme.colors.background.hover};
            transform: translateY(-1px);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'danger':
        return css`
          background: ${props.theme.colors.error};
          color: ${props.theme.colors.text.inverse};
          &:hover:not(:disabled) { 
            background: ${props.theme.colors.errorDark};
            transform: translateY(-1px);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'success':
        return css`
          background: ${props.theme.colors.success};
          color: ${props.theme.colors.text.inverse};
          &:hover:not(:disabled) { 
            background: ${props.theme.colors.successDark};
            transform: translateY(-1px);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      default:
        return css`
          background: ${props.theme.colors.primary};
          color: ${props.theme.colors.text.inverse};
          &:hover:not(:disabled) { 
            background: ${props.theme.colors.primaryDark};
            transform: translateY(-1px);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
    }
  }}

  ${props => props.loading && css`
    color: transparent !important;
    pointer-events: none;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-top: -8px;
      margin-left: -8px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: ${spin} 0.8s linear infinite;
    }
  `}
`

export function Button({ $variant = 'primary', size, fullwidth, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <StyledButton
      $variant={$variant}
      size={size}
      $fullwidth={fullwidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
}