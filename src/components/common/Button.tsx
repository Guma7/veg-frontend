'use client'

import styled from 'styled-components'

const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'primary' ? '#4CAF50' : 'transparent'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#4CAF50'};
  border: 2px solid #4CAF50;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${props => props.$variant === 'primary' ? '#45a049' : '#e8f5e9'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export default StyledButton