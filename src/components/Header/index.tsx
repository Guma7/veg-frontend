'use client'
import styled from 'styled-components'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContextFront'
import { FaSearch, FaUser } from 'react-icons/fa'
import { Avatar } from '../common/Avatar'

const HeaderContainer = styled.header`
  width: 100%;
  height: 70px;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  position: fixed;
  top: 0;
  z-index: 100;
`

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-family: ${props => props.theme.fonts.primary};
  text-decoration: none;
  font-weight: bold;
`

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-family: ${props => props.theme.fonts.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`

const SearchButton = styled(NavLink)`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    text-decoration: none;
  }
`

export default function Header() {
  const { user, logout } = useAuth()
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  return (
    <HeaderContainer>
      <Logo href="/">Vegan World</Logo>
      <Nav>
        <NavLink href="/receitas">Receitas</NavLink>
        {user ? (
          <>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center' 
                }}
                onClick={toggleDropdown}
              >
                {user.username}
              </button>
              {/* Dropdown */}
              <div 
                className="user-dropdown" 
                style={{ 
                  display: dropdownVisible ? 'block' : 'none', 
                  position: 'absolute', 
                  right: 0, 
                  background: '#fff', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  borderRadius: 8, 
                  marginTop: 8, 
                  minWidth: 120, 
                  zIndex: 10 
                }}
              >
                <NavLink 
                  href={`/users/${user.username}`} 
                  style={{ 
                    display: 'block', 
                    padding: '10px', 
                    color: '#000', 
                    textDecoration: 'none' 
                  }}
                >
                  Meu Perfil
                </NavLink>
                <button 
                  onClick={logout} 
                  style={{ 
                    width: '100%', 
                    background: 'none', 
                    border: 'none', 
                    padding: '10px', 
                    textAlign: 'left', 
                    cursor: 'pointer' 
                  }}
                >
                  Sair
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <NavLink href="/login">Entrar</NavLink>
            <NavLink href="/register">Cadastrar</NavLink>
          </>
        )}
      </Nav>
    </HeaderContainer>
  )
}