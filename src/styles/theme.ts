export const theme = {
  colors: {
    // Verde escuro para o cabeçalho
    primary: 'rgb(33, 77, 57)', // Verde escuro
    primaryLight: 'rgb(37, 86, 40)',
    primaryDark: 'rgb(55, 94, 59)',
    // Gradiente verde escuro para receitas (editável via Color Picker)
    primaryGradientStart: 'rgb(18, 68, 47)', // Início do gradiente (verde escuro)
    primaryGradientEnd: 'hsl(152, 46.20%, 31.40%)',   // Fim do gradiente (verde ainda mais escuro)
    secondary: ' #2196F3',
    error: ' #f44336',
    errorDark: ' #d32f2f',
    warning: ' #ff9800',
    success: ' #4caf50',
    successDark: ' #388e3c',
    // Cores específicas para o navbar
    navbar: {
      logo: ' #FFFFFF', // Branco para o logo
      links: ' #C0C0C0', // Prata para links e nome do usuário
    },
    background: {
      default: ' #f5f5f5',
      paper: ' #ffffff',
      hover: ' #f0f0f0',
      secondary: ' #f8f8f8',
      primary: ' #ffffff'
    },
    text: {
      primary: ' #212121',
      secondary: ' #757575',
      inverse: ' #ffffff',
      disabled: ' #9e9e9e'
    },
    border: ' #e0e0e0'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)'
  },
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    sizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '32px'
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
}

export type Theme = typeof theme

// Garante que a propriedade 'navbar' está corretamente tipada para uso no styled-components