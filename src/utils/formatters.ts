/**
 * Formata strings de opções pré-selecionáveis para exibição
 * Converte texto como "VEG_CARNES" para "Veg Carnes"
 */
export function formatOption(option: string): string {
  if (!option) return '';
  
  // Substitui underscores por espaços
  const withSpaces = option.replace(/_/g, ' ');
  
  // Divide a string em palavras
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}