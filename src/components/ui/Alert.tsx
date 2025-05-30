'use client'
import styled from 'styled-components'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  $variant: 'success' | 'error' | 'warning' | 'info'
}

const AlertContainer = styled.div<AlertProps>`
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  background-color: ${props => {
    switch (props.$variant) {
      case 'success': return `${props.theme.colors.success}20`;
      case 'error': return `${props.theme.colors.error}20`;
      case 'warning': return `${props.theme.colors.warning}20`;
      case 'info': return `${props.theme.colors.primary}20`;
      default: return `${props.theme.colors.primary}20`;
    }
  }};
  
  color: ${props => {
    switch (props.$variant) {
      case 'success': return props.theme.colors.successDark;
      case 'error': return props.theme.colors.errorDark;
      case 'warning': return props.theme.colors.warning;
      case 'info': return props.theme.colors.primaryDark;
      default: return props.theme.colors.primaryDark;
    }
  }};
`;

export const Alert: React.FC<AlertProps> = ({ children, $variant, ...props }) => {
  return (
    <AlertContainer $variant={$variant} {...props}>
      {children}
    </AlertContainer>
  );
};