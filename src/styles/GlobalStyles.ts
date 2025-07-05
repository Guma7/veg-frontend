import styled, { createGlobalStyle } from 'styled-components'
import { Theme } from './theme'

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    caret-color: transparent; /* Remove a barrinha piscante */
  }

  /* Cursor padrão para elementos não editáveis */
  *:not(input):not(textarea):not([contenteditable]) {
    cursor: default;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.colors.background.default};
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.5;
    user-select: text; /* Permite seleção de texto */
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }
`

// TODO: Implement remaining components:
// - Advanced forms
// - Sharing system
// - Statistics components
// - Advanced filter components