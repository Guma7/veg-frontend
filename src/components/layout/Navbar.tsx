'use client'

import { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContextFront'

const Nav = styled.nav`
  background: ${props => props.theme.colors.primary}; /* Verde escuro */
  box-shadow: ${props => props.theme.shadows.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
`

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(Link)`
  color: ${props => props.theme.colors.navbar.logo}; /* Branco */
  font-size: ${props => props.theme.fonts.sizes.xl};
  font-weight: bold;
  text-decoration: none;
`

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  align-items: center;
`

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.navbar.links}; /* Prata */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    color: ${props => props.theme.colors.text.inverse};
  }
`

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s ease;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0%;
  background: linear-gradient(to bottom,rgb(45, 48, 47),rgb(30, 94, 70));
  border: 2.0px solid #888888;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(203, 35, 35, 0.1);
  min-width: 140px;
  z-index: 100;
  --dropdown-height: 78px; 
  height: var(--dropdown-height); 
`;

const DropdownLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Username = styled.span`
  color: #C0C0C0;
  font-weight: bold;
  cursor: pointer;
  margin-left: 8px;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: center;
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  color:rgb(255, 255, 255);
  font-size: 1rem;
  background: transparent;
  &:hover {
    background:rgba(161, 159, 159, 0.39);
  }
`;

// Componente específico para o botão de logout com indentação e posição vertical ajustável
const LogoutDropdownItem = styled(DropdownItem)`
  --text-indent: 2px; /* Controla a indentação horizontal */
  --text-top-offset: -10px; /* Controla a posição vertical do texto */
  text-indent: var(--text-indent);
  position: relative;
  top: var(--text-top-offset); /* Move o texto para cima quando negativo */
`;

// Placeholder para o estado de carregamento
const LoadingPlaceholder = styled.div`
  width: 80px;
  height: 20px;
  background-color: rgb(20, 77, 58);
  border-radius: 4px;
`;

// Importando o componente Avatar comum
import { Avatar } from '../common/Avatar'

export function Navbar() {
  const { user, logout, loading } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  let dropdownTimeout: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => setDropdownOpen(false), 120);
  };

  return (
    <Nav>
      <NavContent>
        <Logo href="/">Vegan World</Logo>
        
        <NavLinks>
          <NavLink href="/receitas">Receitas</NavLink>
          {loading ? (
            // Não mostrar nada ou mostrar um placeholder durante o carregamento
            <LoadingPlaceholder />
          ) : user ? (
            <UserMenu
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Username>{user.username}</Username>
              {dropdownOpen && (
                <Dropdown
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <DropdownLink onClick={() => {
                    setDropdownOpen(false);
                    window.location.href = '/profile';
                  }}>
                    <DropdownItem>Meu Perfil</DropdownItem>
                  </DropdownLink>
                  <LogoutDropdownItem onClick={logout}>Sair</LogoutDropdownItem>
                </Dropdown>
              )}
            </UserMenu>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <NavLink href="/register">Registrar</NavLink>
            </>
          )}
        </NavLinks>
      </NavContent>
    </Nav>
  )
}