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
      <head>
        <link rel="preload" as="image" href="/frut.jpg" fetchPriority="high" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
      </head>
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
