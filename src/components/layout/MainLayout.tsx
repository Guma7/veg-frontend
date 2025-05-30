'use client'

import styled from 'styled-components'
import Header from '../Header'
import { Footer } from './Footer'

const Main = styled.main`
  min-height: 100vh;
  padding-top: 70px;
  background: ${props => props.theme.colors.background.default};
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Main>
        <Container>{children}</Container>
      </Main>
      <Footer />
    </>
  )
}