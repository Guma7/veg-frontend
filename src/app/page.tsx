'use client'

import styled from 'styled-components'
import { FeaturedRecipes } from '../components/home/FeaturedRecipes'

const Hero = styled.div`
  background-color: #000000;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)),
              url('/frut.jpg') center/cover;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  padding: ${props => props.theme.spacing.xl};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  will-change: transform;
  filter: contrast(1.1) brightness(0.9);
`

const HeroContent = styled.div`
  max-width: 800px;
`

const HeroTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes['2xl']};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: ${props => props.theme.fonts.weights.bold};
  color: rgba(255, 255, 255, 0.98);
`

const HeroText = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: ${props => props.theme.fonts.weights.medium};
  color: rgba(255, 255, 255, 0.92);
`

export default function HomePage() {
  return (
    <>
      <link rel="preload" as="image" href="/frut.jpg" />
      <Hero>
        <HeroContent>
          <HeroTitle>Descubra o Mundo da Culinária Vegana</HeroTitle>
          <HeroText>
            Explore receitas deliciosas, saudáveis e 100% vegetais
          </HeroText>
        </HeroContent>
      </Hero>
      
      <FeaturedRecipes />
    </>
  )
}
