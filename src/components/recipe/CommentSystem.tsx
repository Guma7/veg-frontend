'use client'

import styled from 'styled-components'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { Avatar } from '../common/Avatar'

const CommentContainer = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`

const CommentForm = styled.form`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const CommentInput = styled.textarea`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  min-height: 100px;
  resize: vertical;
  cursor: text !important;
  caret-color: auto !important;
`

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const Comment = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
`

export function CommentSystem({ recipeId }: { recipeId: number }) {
  const [comment, setComment] = useState('')
  interface Comment {
    id: number
    content: string
    author: {
      name: string
      avatar: string
    }
  }

  const [comments, setComments] = useState<Comment[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica para enviar comentário
  }

  return (
    <CommentContainer>
      <h2>Comentários</h2>
      
      <CommentForm onSubmit={handleSubmit}>
        <CommentInput
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Deixe seu comentário..."
        />
        <Button type="submit">Enviar</Button>
      </CommentForm>

      <CommentList>
        {comments.map((comment) => (
          <Comment key={comment.id}>
            <Avatar src={comment.author.avatar} alt={comment.author.name} />
            <div>
              <strong>{comment.author.name}</strong>
              <p>{comment.content}</p>
            </div>
          </Comment>
        ))}
      </CommentList>
    </CommentContainer>
  )
}