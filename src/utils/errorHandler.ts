/**
 * Utilitário para tratamento de erros da API
 */

interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Função para extrair mensagens de erro amigáveis das respostas da API
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'Ocorreu um erro desconhecido';
  
  // Se for um erro da API com dados estruturados
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    
    // Verificar se temos dados detalhados do erro
    if (apiError.data) {
      // Erro de permissão (Forbidden)
      if (apiError.status === 403) {
        return apiError.data.detail || 'Você não tem permissão para acessar este recurso';
      }
      
      // Erro de autenticação
      if (apiError.status === 401) {
        return apiError.data.detail || 'Autenticação necessária para acessar este recurso';
      }
      
      // Outros erros com detalhes
      if (apiError.data.detail) {
        return apiError.data.detail;
      }
      
      // Verificar se há mensagem no objeto data
      if (typeof apiError.data === 'string') {
        return apiError.data;
      }
      
      // Verificar se há mensagem em formato não padrão
      if (apiError.data.message) {
        return apiError.data.message;
      }
    }
    
    // Usar a mensagem do erro se disponível
    if (apiError.message && apiError.message !== 'Error') {
      return apiError.message;
    }
    
    // Mensagens baseadas no código de status
    if (apiError.status) {
      switch (apiError.status) {
        case 400: return 'Requisição inválida';
        case 401: return 'Autenticação necessária';
        case 403: return 'Acesso negado';
        case 404: return 'Recurso não encontrado';
        case 429: return 'Muitas requisições. Tente novamente mais tarde';
        case 500: return 'Erro interno do servidor';
        default: return `Erro ${apiError.status}`;
      }
    }
  }
  
  // Se for um erro simples com mensagem
  if (error instanceof Error) {
    return error.message || 'Erro desconhecido';
  }
  
  // Fallback para string ou outros tipos
  return String(error) || 'Ocorreu um erro desconhecido';
}

/**
 * Função para lidar com erros de autenticação
 * Redireciona para login e limpa tokens de autenticação
 */
// Função para tratar erros de autenticação e redirecionar para login
export function handleAuthError(error: any): void {
  // Redirecionar para a página de login
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

/**
 * Função para lidar com erros de permissão
 * Mostra mensagem específica e redireciona para página apropriada
 */
export function handleForbiddenError(error: ApiError): void {
  console.error('Erro de permissão:', error);
  
  // Mostrar mensagem de erro ao usuário
  if (typeof window !== 'undefined') {
    // Aqui poderia ser implementado um toast ou notificação
    // usando a biblioteca de UI do projeto
    alert(getErrorMessage(error) || 'Você não tem permissão para acessar este recurso');
    
    // Redirecionar para a página inicial ou outra página apropriada
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }
}