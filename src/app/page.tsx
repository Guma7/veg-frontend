'use client'

import styled from 'styled-components'
import { FeaturedRecipes } from '../components/home/FeaturedRecipes'

const Hero = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/hero-bg.jpg') center/cover;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: ${props => props.theme.spacing.xl};
`

const HeroContent = styled.div`
  max-width: 800px;
`

const HeroTitle = styled.h1`
  font-size: ${props => props.theme.fonts.sizes.xxl};
  margin-bottom: ${props => props.theme.spacing.lg};
`

const HeroText = styled.p`
  font-size: ${props => props.theme.fonts.sizes.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`

export default function HomePage() {
  return (
    <>
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
