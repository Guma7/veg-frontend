import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
`

const LoadingCard = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  height: 300px;
  border-radius: 8px;
  animation: ${pulse} 1.5s infinite;
`

const Message = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
  margin: 2rem 0;
`

export const LoadingState = () => (
  <LoadingGrid>
    {Array(6).fill(0).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </LoadingGrid>
)

export const ErrorState = ({ message }: { message: string }) => (
  <Container>
    <Message>{message}</Message>
    <button onClick={() => window.location.reload()}>
      Tentar novamente
    </button>
  </Container>
)

export const EmptyState = ({ message }: { message: string }) => (
  <Container>
    <Message>{message}</Message>
  </Container>
)