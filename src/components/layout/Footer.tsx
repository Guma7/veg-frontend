'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa'

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.background.paper};
  padding: ${props => props.theme.spacing.xl} 0;
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  padding: 0 ${props => props.theme.spacing.xl};
`

const FooterSection = styled.div`
  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  
  a {
    color: ${props => props.theme.colors.text.secondary};
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`

export function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Vegan World</h3>
          <p>Sua plataforma de receitas veganas</p>
          <SocialLinks>
            <a href="#"><FaGithub size={24} /></a>
            <a href="#"><FaInstagram size={24} /></a>
            <a href="#"><FaTwitter size={24} /></a>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Links Úteis</h3>
          <ul>
            <li><Link href="/sobre">Sobre</Link></li>
            <li><Link href="/contato">Contato</Link></li>
            <li><Link href="/termos">Termos de Uso</Link></li>
            <li><Link href="/privacidade">Privacidade</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Categorias</h3>
          <ul>
            <li><Link href="/receitas?categoria=entrada">Entradas</Link></li>
            <li><Link href="/receitas?categoria=principal">Pratos Principais</Link></li>
            <li><Link href="/receitas?categoria=sobremesa">Sobremesas</Link></li>
            <li><Link href="/receitas?categoria=bebida">Bebidas</Link></li>
          </ul>
        </FooterSection>
      </FooterContent>
    </FooterContainer>
  )
}