'use client'
import { Container } from '../../../components/ui/Container'
import { Card, CardTitle } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import RecipeImageUpload from '../../../components/recipes/RecipeImageUpload'
import { useAuth } from '../../../contexts/AuthContextFront'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'

// Definição da variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const FormContainer = styled(Card)`
  max-width: 800px;
  margin: ${props => props.theme.spacing['3xl']} auto;
  padding: ${props => props.theme.spacing.xl};
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  position: relative;
`

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
`

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: white;
`

const TextArea = styled.textarea<{ small?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  min-height: ${props => props.small ? '60px' : '200px'};
  font-family: ${props => props.theme.fonts.primary};
  resize: vertical;
  cursor: text !important;
  caret-color: auto !important;
`

// Removido campo SubgenreInput que não é mais utilizado

export default function CriarReceita() {
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<{
    classes: Array<{ value: string; label: string }>;
    subclasses: Array<{ value: string; label: string }>;
    genres: Array<{ value: string; label: string }>;
  }>({classes: [], subclasses: [], genres: []})
  const [formData, setFormData] = useState({
    title: '',
    recipe_class: '',
    style: '',
    genre: '',
    nutritional_level: '',
    does_not_contain: '',
    traditional: '',
    ingredients: '',
    instructions: '',
    youtube_link: '',
    image: null as File | null
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recipes/categories/`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.image) {
      setError('A imagem da receita é obrigatória')
      return
    }

    setLoading(true)
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value)
      }
    })

    try {
      // Importar a função fetchCSRFToken do auth.ts
      const { fetchCSRFToken } = await import('../../../services/auth');
      
      // Obter o token CSRF usando a função do auth.ts
      let CSRFToken = await fetchCSRFToken();
      console.log('Token CSRF para criar receita:', CSRFToken);
      
      if (!CSRFToken) {
        throw new Error('Não foi possível obter o token CSRF');
      }
      
      // Verificar e corrigir o comprimento do token
      if (CSRFToken.length !== 64) {
        console.warn('Token CSRF com comprimento incorreto em criar receita:', CSRFToken.length, 'esperado: 64');
        
        // Ajustar o comprimento do token para 64 caracteres
        if (CSRFToken.length < 64) {
          // Se for menor que 64, preencher com caracteres até atingir 64
          const padding = 'X'.repeat(64 - CSRFToken.length);
          CSRFToken = CSRFToken + padding;
          console.log('Token CSRF ajustado com padding em criar receita:', CSRFToken.length);
        } else if (CSRFToken.length > 64) {
          // Se for maior que 64, truncar para 64 caracteres
          CSRFToken = CSRFToken.substring(0, 64);
          console.log('Token CSRF truncado em criar receita:', CSRFToken.length);
        }
      }
      
      console.log('Token CSRF final para criar receita:', CSRFToken.substring(0, 10) + '...' + CSRFToken.substring(CSRFToken.length - 10));
      console.log('Comprimento do token CSRF final:', CSRFToken.length);
      
      // Log do FormData para depuração
      console.log('Enviando dados para o servidor:');
      for (const pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `Arquivo: ${pair[1].name} (${pair[1].size} bytes)` : pair[1]));
      }
      
      const response = await fetch(`${API_URL}/api/recipes/`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'X-Csrftoken': CSRFToken
        }
      })

      if (response.ok) {
        router.push('/receitas')
      } else {
        const data = await response.json()
        console.error('Erro ao criar receita:', data)
        setError(data.detail || data.message || 'Erro ao criar receita')
      }
    } catch (error) {
      console.error('Erro completo:', error)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <FormContainer>
        <CardTitle>Criar Nova Receita</CardTitle>
        {error && <Alert $variant="error">{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <RecipeImageUpload
            onImageSelect={(file) => setFormData(prev => ({ ...prev, image: file }))}
          />

          <FormGroup>
            <Label>Nome da Receita *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              fullwidth
            />
          </FormGroup>

          <FormGroup>
            <Label>Classe *</Label>
            <Select
              value={formData.recipe_class}
              onChange={(e) => setFormData(prev => ({ ...prev, recipe_class: e.target.value }))}
              required
            >
              <option value="">Selecione...</option>
              {categories.classes.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Estilo *</Label>
            <Select
              value={formData.style}
              onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
              required
            >
              <option value="">Selecione...</option>
              <option value="GOURMET">Gourmet</option>
              <option value="CASEIRA">Caseira</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Gênero *</Label>
            <Input
              value={formData.genre}
              onChange={(e) => {
                if (e.target.value.length <= 14) {
                  setFormData(prev => ({ ...prev, genre: e.target.value }))
                }
              }}
              required
              maxLength={14}
              placeholder="Ex: Pizza, Salada, etc"
            />
          </FormGroup>

          <FormGroup>
            <Label>Nível Nutricional</Label>
            <Select
              value={formData.nutritional_level}
              onChange={(e) => setFormData(prev => ({ ...prev, nutritional_level: e.target.value }))}
            >
              <option value="">Selecione...</option>
              <option value="BAIXO">Baixo</option>
              <option value="MEDIO">Médio</option>
              <option value="ALTO">Alto</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Não Contém</Label>
            <Input
              value={formData.does_not_contain}
              onChange={(e) => setFormData(prev => ({ ...prev, does_not_contain: e.target.value }))}
              placeholder="Ex: Açúcar, Glúten, etc"
            />
          </FormGroup>

          <FormGroup>
            <Label>Tradicional</Label>
            <Input
              value={formData.traditional}
              onChange={(e) => setFormData(prev => ({ ...prev, traditional: e.target.value }))}
              placeholder="Ex: Rio Grande do Sul, Japão, etc"
            />
          </FormGroup>

          <FormGroup>
            <Label>Ingredientes *</Label>
            <TextArea
              value={formData.ingredients}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
              required
              placeholder="Digite os ingredientes, um por linha"
            />
          </FormGroup>

          <FormGroup>
            <Label>Modo de Preparo *</Label>
            <TextArea
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              required
              placeholder="Digite o passo a passo do preparo"
            />
          </FormGroup>

          <FormGroup>
            <Label>Link do YouTube (opcional)</Label>
            <Input
              type="url"
              value={formData.youtube_link}
              onChange={(e) => setFormData(prev => ({ ...prev, youtube_link: e.target.value }))}
              placeholder="Link do YouTube (opcional)"
              fullwidth
            />
          </FormGroup>

          <Button 
            type="submit" 
            $variant="primary" 
            fullwidth>
            Salvar Alterações
          </Button>
        </form>
      </FormContainer>
    </Container>
  )
}