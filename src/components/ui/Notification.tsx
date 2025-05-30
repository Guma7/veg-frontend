'use client'

import styled, { keyframes, css } from 'styled-components'
import { useEffect, useState } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`

const NotificationContainer = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  top: ${props => props.theme.spacing.xl};
  right: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  animation: ${slideIn} 0.3s ease-out;
  z-index: 1100;

  ${props => {
    switch (props.type) {
      case 'success':
        return css`border-left: 4px solid ${props.theme.colors.success};`
      case 'error':
        return css`border-left: 4px solid ${props.theme.colors.error};`
      default:
        return css`border-left: 4px solid ${props.theme.colors.primary};`
    }
  }}
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  padding: ${props => props.theme.spacing.xs};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Notification({ message, type, duration = 5000, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <NotificationContainer type={type}>
      {type === 'success' && <FaCheckCircle color="green" />}
      {type === 'error' && <FaExclamationCircle color="red" />}
      <span>{message}</span>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
    </NotificationContainer>
  )
}