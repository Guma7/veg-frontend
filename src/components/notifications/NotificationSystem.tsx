'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { FaBell, FaHeart, FaComment, FaStar } from 'react-icons/fa'

const NotificationContainer = styled.div`
  position: relative;
`

const NotificationBell = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text.primary};
`

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
`

const NotificationPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`

const NotificationItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.background.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`

const NotificationIcon = styled.div<{ type: string }>`
  color: ${props => {
    switch (props.type) {
      case 'like': return props.theme.colors.error;
      case 'comment': return props.theme.colors.primary;
      case 'rating': return props.theme.colors.warning;
      default: return props.theme.colors.text.secondary;
    }
  }};
`

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'rating';
  message: string;
  read: boolean;
  createdAt: string;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const ws = new WebSocket('wss://veg-backend-rth1.onrender.com/ws/notifications/')
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    }

    return () => ws.close()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <FaHeart />;
      case 'comment': return <FaComment />;
      case 'rating': return <FaStar />;
      default: return <FaBell />;
    }
  }

  return (
    <NotificationContainer>
      <NotificationBell onClick={() => setIsOpen(!isOpen)}>
        <FaBell size={24} />
        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      </NotificationBell>

      {isOpen && (
        <NotificationPanel>
          {notifications.map(notification => (
            <NotificationItem key={notification.id}>
              <NotificationIcon type={notification.type}>
                {getIcon(notification.type)}
              </NotificationIcon>
              <div>
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
              </div>
            </NotificationItem>
          ))}
        </NotificationPanel>
      )}
    </NotificationContainer>
  )
}