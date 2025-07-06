import { createGlobalStyle } from 'styled-components'
import { Theme } from './theme'

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    caret-color: transparent; /* Remove a barrinha piscante */
  }

  body {
    background: ${props => props.theme.colors.background.default};
    color: ${props => props.theme.colors.text.primary};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    user-select: text; /* Permite seleção de texto */
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
  }

  button {
    font-family: inherit;
  }

  main {
    min-height: calc(100vh - 64px);
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Cursor padrão para elementos não editáveis */
  *:not(input):not(textarea):not([contenteditable]) {
    cursor: default;
  }

  /* Mantém cursor de texto apenas para campos editáveis */
  input, textarea, [contenteditable] {
    cursor: text;
  }

  ::selection {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`