'use client'

import styled from 'styled-components'

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.background.paper};
  padding: ${props => props.theme.spacing.xl};
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Copyright = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`

const FooterLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`

const FooterLink = styled.a`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

export function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>&copy; {new Date().getFullYear()} VEG. All rights reserved.</Copyright>
        <FooterLinks>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  )
}