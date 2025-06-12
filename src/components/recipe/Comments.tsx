'use client'

import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContextFront'
import { Avatar } from '../common/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'
import { FiEdit2, FiTrash2, FiChevronDown } from 'react-icons/fi'

// Definir a variável API_URL uma única vez no início do arquivo
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

const CommentsSection = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`

const CommentForm = styled.form`
  margin-bottom: ${props => props.theme.spacing.xl};
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  font-family: inherit;
  resize: vertical;
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const CommentCard = styled.div`
  background: ${props => props.theme.colors.background.paper};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  position: relative;
`

const CommentActions = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing.xs};
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const LoadMoreButton = styled(Button)`
  margin: ${props => props.theme.spacing.lg} auto;
  display: block;
`

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
`

const CommentMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.sm};
`

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    profileImage: string
  }
}

interface CommentsProps {
  recipeId: string
}

export function Comments({ recipeId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting || !user) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      // Importar e usar a função fetchCsrfToken do auth.ts
      const { fetchCSRFToken } = await import('../../services/auth');
      const CSRFToken = await fetchCSRFToken();
      
      if (!CSRFToken) {
        throw new Error('Não foi possível obter o token CSRF');
      }
      
      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFToken
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment.trim() })
      })

      const responseText = await response.text()
      
      if (!response.ok) {
        let errorMessage = 'Erro ao enviar comentário'
        if (responseText) {
          try {
            const data = JSON.parse(responseText)
            errorMessage = data.message || errorMessage
          } catch (jsonError) {
            console.error('Erro ao analisar JSON de erro:', jsonError)
          }
        }
        throw new Error(errorMessage)
      }

      if (!responseText) {
        throw new Error('Resposta vazia do servidor')
      }
      
      try {
        const newCommentData = JSON.parse(responseText)
        setComments(prev => [newCommentData, ...prev])
        setNewComment('')
      } catch (jsonError) {
        console.error('Erro ao analisar JSON da resposta:', jsonError)
        throw new Error('Erro ao processar resposta do servidor')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao enviar comentário')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [recipeId])

  const fetchComments = async (pageNum = 1, append = false) => {
    if (!recipeId) return;
    
    try {
      // Usar a URL da API com base no ambiente
      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/comments/?page=${pageNum}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const responseText = await response.text();
        if (!responseText) {
          // Lidar com resposta vazia
          setComments(prev => append ? [...prev] : [])
          setHasMore(false)
          return;
        }
        try {
          const data = JSON.parse(responseText);
          setComments(prev => append ? [...prev, ...data.results] : data.results)
          setHasMore(data.next !== null)
          setPage(pageNum)
        } catch (jsonError) {
          console.error('Erro ao analisar JSON:', jsonError, 'Resposta:', responseText)
          setError('Erro ao processar dados do servidor')
        }
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    }
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return
    setIsSubmitting(true)
    setError(null)

    try {
      // Obter o token CSRF do cookie
      const getCSRFToken = (): string => {
        if (typeof document === 'undefined') return '';
        
        const cookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('CSRFToken='));
          
        if (cookie) {
          return cookie.split('=')[1];
        }
        
        return '';
      };

      // Obter o token CSRF antes de fazer a requisição
      try {
        await fetch(`${API_URL}/api/auth/csrf/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
      } catch (error) {
        console.error('Erro ao obter token CSRF:', error);
      }

      const CSRFToken = getCSRFToken();

      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/comments/${commentId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRFToken
        },
        credentials: 'include',
        body: JSON.stringify({ content: editContent.trim() })
      })

      const responseText = await response.text()
      
      if (!response.ok) {
        let errorMessage = 'Erro ao editar comentário'
        if (responseText) {
          try {
            const data = JSON.parse(responseText)
            errorMessage = data.message || errorMessage
          } catch (jsonError) {
            console.error('Erro ao analisar JSON de erro:', jsonError)
          }
        }
        throw new Error(errorMessage)
      }

      if (!responseText) {
        throw new Error('Resposta vazia do servidor')
      }
      
      try {
        const updatedComment = JSON.parse(responseText)
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ))
        setEditingComment(null)
        setEditContent('')
      } catch (jsonError) {
        console.error('Erro ao analisar JSON da resposta:', jsonError)
        throw new Error('Erro ao processar resposta do servidor')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao editar comentário')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return

    try {
      // Importar e usar a função fetchCsrfToken do auth.ts
      const { fetchCSRFToken } = await import('../../services/auth');
      const CSRFToken = await fetchCSRFToken();
      
      if (!CSRFToken) {
        throw new Error('Não foi possível obter o token CSRF');
      }

      const response = await fetch(`${API_URL}/api/recipes/${recipeId}/comments/${commentId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': CSRFToken
        }
      })

      if (!response.ok) throw new Error('Erro ao excluir comentário')

      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao excluir comentário')
    }
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1, true)
    }
  }

  return (
    <CommentsSection>
      <h2>Comentários</h2>
      
      {user && (
        <CommentForm onSubmit={handleSubmit}>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Deixe seu comentário..."
            disabled={loading}
          />
          {error && <Alert $variant="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {loading ? 'Enviando...' : 'Comentar'}
          </Button>
        </CommentForm>
      )}

      <CommentList>
        {comments.map(comment => (
          <CommentCard key={comment.id}>
            <CommentHeader>
              <Avatar 
                src={comment.author.profileImage} 
                alt={comment.author.username} 
                size="sm" 
              />
              <CommentMeta>
                <strong>{comment.author.username}</strong>
                <span>•</span>
                <time>{new Date(comment.createdAt).toLocaleDateString()}</time>
              </CommentMeta>
            </CommentHeader>
            {editingComment === comment.id ? (
              <form onSubmit={(e) => {
                e.preventDefault()
                handleEdit(comment.id)
              }}>
                <TextArea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button type="submit" disabled={isSubmitting || !editContent.trim()} size="sm">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  type="button"
                  $variant="outline"
                  onClick={() => {
                    setEditingComment(null)
                    setEditContent('')
                  }}
                  size="sm"
                  style={{ marginLeft: '8px' }}
                >
                  Cancelar
                </Button>
              </form>
            ) : (
              <p>{comment.content}</p>
            )}
            {user && user.id === comment.author.id && !editingComment && (
              <CommentActions>
                <ActionButton
                  onClick={() => {
                    setEditingComment(comment.id)
                    setEditContent(comment.content)
                  }}
                  title="Editar comentário"
                >
                  <FiEdit2 size={16} />
                </ActionButton>
                <ActionButton
                  onClick={() => handleDelete(comment.id)}
                  title="Excluir comentário"
                >
                  <FiTrash2 size={16} />
                </ActionButton>
              </CommentActions>
            )}
          </CommentCard>
        ))}
      </CommentList>
    </CommentsSection>
  )
}