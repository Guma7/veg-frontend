'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { Button } from './Button'
import { Input } from './Input'
import { Rating } from './Rating'

const CommentsContainer = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const CommentItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.secondary};
`

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const CommentAuthor = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`

const CommentDate = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.sm};
`

const CommentText = styled.p`
  color: ${props => props.theme.colors.text.primary};
  margin: ${props => props.theme.spacing.sm} 0;
`

interface Comment {
  id: number
  author: string
  text: string
  rating: number
  date: string
}

interface CommentsProps {
  recipeId: number
  initialComments?: Comment[]
  onSubmit?: (comment: Omit<Comment, 'id' | 'date'>) => Promise<void>
}

export function Comments({ recipeId, initialComments = [], onSubmit }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit?.({ 
        author: 'Usuário', // Será substituído pelo nome do usuário logado
        text: newComment,
        rating
      })

      // Simula a adição do comentário (remover quando integrado com backend)
      const comment: Comment = {
        id: Date.now(),
        author: 'Usuário',
        text: newComment,
        rating,
        date: new Date().toISOString()
      }
      setComments(prev => [comment, ...prev])
      setNewComment('')
      setRating(0)
    } catch (error) {
      console.error('Erro ao enviar comentário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CommentsContainer>
      <CommentForm onSubmit={handleSubmit}>
        <Rating
          initialValue={rating}
          onChange={setRating}
          maxValue={10}
        />
        <Input
          as="textarea"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Deixe seu comentário sobre a receita..."
          rows={4}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={!newComment.trim() || rating === 0 || isSubmitting}
          loading={isSubmitting}
        >
          Enviar Comentário
        </Button>
      </CommentForm>

      <CommentList>
        {comments.map(comment => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <CommentAuthor>{comment.author}</CommentAuthor>
              <CommentDate>
                {new Date(comment.date).toLocaleDateString('pt-BR')}
              </CommentDate>
            </CommentHeader>
            <Rating initialValue={comment.rating} readOnly showValue />
            <CommentText>{comment.text}</CommentText>
          </CommentItem>
        ))}
      </CommentList>
    </CommentsContainer>
  )
}