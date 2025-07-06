import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const SkeletonCard = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
`

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 0%,
    rgba(255, 255, 255, 0.2) 50%,
    ${props => props.theme.colors.background.secondary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`

const SkeletonContent = styled.div`
  padding: 16px;
`

const SkeletonTitle = styled.div`
  height: 20px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 0%,
    rgba(255, 255, 255, 0.2) 50%,
    ${props => props.theme.colors.background.secondary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
`

const SkeletonDescription = styled.div`
  height: 14px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 0%,
    rgba(255, 255, 255, 0.2) 50%,
    ${props => props.theme.colors.background.secondary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  width: 80%;
  margin-bottom: 8px;
`

const SkeletonMeta = styled.div`
  height: 12px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.secondary} 0%,
    rgba(255, 255, 255, 0.2) 50%,
    ${props => props.theme.colors.background.secondary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  width: 60%;
`

export const RecipeSkeleton = () => (
  <SkeletonCard>
    <SkeletonImage />
    <SkeletonContent>
      <SkeletonTitle />
      <SkeletonDescription />
      <SkeletonMeta />
    </SkeletonContent>
  </SkeletonCard>
)

export const RecipeGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <RecipeSkeleton key={index} />
    ))}
  </>
)