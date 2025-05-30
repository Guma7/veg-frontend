import React, { ReactNode, CSSProperties } from 'react';
import styled from 'styled-components';

interface ActionButtonProps {
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
}

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  onClick, 
  className, 
  type = 'button',
  style 
}) => {
  return (
    <StyledButton 
      type={type} 
      onClick={onClick} 
      className={className}
      style={style}
    >
      {children}
    </StyledButton>
  );
};

export default ActionButton;