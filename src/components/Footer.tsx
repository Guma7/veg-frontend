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
  font-size: ${props => props.theme.fonts.sizes.sm};
`

const FooterLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};

  a {
    color: ${props => props.theme.colors.text.secondary};
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© 2024 Veg. Todos os direitos reservados.</Copyright>
        <FooterLinks>
          <a href="/sobre">Sobre</a>
          <a href="/contato">Contato</a>
          <a href="/privacidade">Privacidade</a>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  )
}