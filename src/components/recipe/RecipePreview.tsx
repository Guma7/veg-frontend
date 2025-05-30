import styled from 'styled-components'
import { RecipePreviewProps } from '../../types/props'

const PreviewContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const Title = styled.h1`
  margin: 1rem 0;
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text.primary};
`

const Content = styled.div`
  h2 {
    margin: 1.5rem 0 1rem;
    font-size: 1.4rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`

export default function RecipePreview({ data, images, tags }: RecipePreviewProps) {
  return (
    <PreviewContainer>
      {images[0] && (
        <img 
          src={images[0]} 
          alt={data.title || 'Preview'} 
          style={{ width: '100%', borderRadius: '8px' }}
        />
      )}
      
      <Title>{data.title || 'Nova Receita'}</Title>
      
      <Content>
        <h2>Descrição</h2>
        <div dangerouslySetInnerHTML={{ __html: data.description || '' }} />
        
        <h2>Modo de Preparo</h2>
        <div dangerouslySetInnerHTML={{ __html: data.instructions || '' }} />
      </Content>
    </PreviewContainer>
  )
}