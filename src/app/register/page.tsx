'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { Form, FormGroup, Label, ErrorMessage } from '../../components/ui/Form'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { TermsModal } from '../../components/ui/TermsModal'
import { useAuth } from '../../contexts/AuthContextFront'

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
`

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #4CAF50;
  text-align: center;
`

const TermsText = styled.p`
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
`

const TermsLink = styled.span`
  color: #4CAF50;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #45a049;
  }
`

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    
    if (!termsAccepted) {
      setError('Você precisa aceitar os termos e condições')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await register(username, email, password)
      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    setTermsModalOpen(false)
  }

  return (
    <Container>
      <Title>Criar Conta</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">Nome de Usuário</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <TermsText>
          Ao criar uma conta, você concorda com nossos{' '}
          <TermsLink onClick={() => setTermsModalOpen(true)}>
            Termos e Condições
          </TermsLink>
        </TermsText>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </Button>
      </Form>
      
      <TermsModal 
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={handleAcceptTerms}
      />
    </Container>
  )
}