'use client'

import styled from 'styled-components'
import DOMPurify from 'isomorphic-dompurify'

const InstructionsContainer = styled.div`
  .recipe-instructions {
    font-size: ${props => props.theme.fonts.sizes.md};
    line-height: 1.6;
    
    ol {
      padding-left: 1.5rem;
      margin: 1rem 0;
    }

    li {
      margin-bottom: 1rem;
    }

    strong {
      color: ${props => props.theme.colors.text.primary};
    }
  }
`

interface RecipeInstructionsProps {
  instructions: string
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const sanitizedHtml = DOMPurify.sanitize(instructions, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'br', 'p', 'ul', 'ol', 'li'],
  });

  return (
    <InstructionsContainer>
      <div 
        className="recipe-instructions"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      />
    </InstructionsContainer>
  )
}