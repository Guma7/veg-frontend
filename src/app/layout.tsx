'use client'

import { ThemeProvider } from 'styled-components'
import StyledComponentsRegistry from '../lib/registry'
import { AuthProvider } from '../contexts/AuthContextFront'
import { Navbar } from '../components/layout/Navbar'
import { theme, Theme } from '../styles/theme'
import { GlobalStyle } from '../styles/global'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AuthProvider>
              <Navbar />
              <main>{children}</main>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
