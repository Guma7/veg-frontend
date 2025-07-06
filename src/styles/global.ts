import { createGlobalStyle } from 'styled-components'
import { Theme } from './theme'

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
  }

  /* Remove cursor de texto e caret apenas de elementos não editáveis */
  *:not(input):not(textarea):not([contenteditable]):not([contenteditable="true"]):not(.ProseMirror):not(.tiptap-editor):not(.tiptap-editor *) {
    caret-color: transparent;
    cursor: default;
  }
  
  /* Exceção específica para elementos dentro do ProseMirror */
  .ProseMirror *:not(.tiptap-button):not(.tiptap-toolbar) {
    cursor: text !important;
    caret-color: auto !important;
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

  /* Mantém cursor de texto e caret para campos editáveis */
  input, textarea, [contenteditable], [contenteditable="true"], .ProseMirror, .ProseMirror *, .tiptap-editor .ProseMirror, .tiptap-editor .ProseMirror * {
    cursor: text !important;
    caret-color: auto !important;
  }

  /* Garante que campos de formulário tenham outline quando focados */
  input:focus, textarea:focus, [contenteditable]:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  ::selection {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`