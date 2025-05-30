'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaSearch, FaUser, FaPlus } from 'react-icons/fa'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.sm};
  z-index: 1000;
`

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xl};
  color: ${props => props.theme.colors.primary};
`

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  align-items: center;
`

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

export function Header() {
  return (
    <HeaderContainer>
      <Nav>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo>Vegan World</Logo>
        </Link>
        
        <NavLinks>
          <NavLink href="/receitas">
            <FaSearch /> Explorar
          </NavLink>
          <NavLink href="/receitas/nova">
            <FaPlus /> Nova Receita
          </NavLink>
          <NavLink href="/perfil">
            <FaUser /> Perfil
          </NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  )
}