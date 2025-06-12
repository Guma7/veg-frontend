// Arquivo de teste para debug do token CSRF

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

// Função para testar obtenção do token CSRF
async function testCSRFToken() {
  console.log('=== TESTE DE TOKEN CSRF ===');
  
  try {
    // 1. Verificar cookies existentes
    console.log('1. Cookies atuais:', document.cookie);
    
    // 2. Fazer requisição para obter token CSRF
    console.log('2. Fazendo requisição para:', `${API_URL}/api/auth/csrf/`);
    
    const response = await fetch(`${API_URL}/api/auth/csrf/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('3. Status da resposta:', response.status);
    console.log('4. Headers da resposta:', [...response.headers.entries()]);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('5. Dados da resposta:', data);
    
    // 3. Verificar token na resposta JSON
    if (data && data.CSRFToken) {
      console.log('6. Token CSRF da resposta JSON:', data.CSRFToken);
      console.log('7. Comprimento do token (JSON):', data.CSRFToken.length);
    }
    
    // 4. Verificar cookies após a requisição
    console.log('8. Cookies após requisição:', document.cookie);
    
    // 5. Extrair token do cookie
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='));
      
    if (cookieToken) {
      const token = cookieToken.split('=')[1];
      console.log('9. Token CSRF do cookie:', token);
      console.log('10. Comprimento do token (cookie):', token.length);
    } else {
      console.log('9. ERRO: Cookie csrftoken não encontrado!');
    }
    
    // 6. Testar requisição POST com token
    const finalToken = data?.CSRFToken || (cookieToken ? cookieToken.split('=')[1] : '');
    
    if (finalToken) {
      console.log('11. Testando requisição POST com token:', finalToken);
      
      const testResponse = await fetch(`${API_URL}/api/auth/me/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Csrftoken': finalToken,
          'Accept': 'application/json'
        }
      });
      
      console.log('12. Status da requisição de teste:', testResponse.status);
      
      if (!testResponse.ok) {
        const errorData = await testResponse.text();
        console.log('13. Erro na requisição de teste:', errorData);
      } else {
        console.log('13. Requisição de teste bem-sucedida!');
      }
    } else {
      console.log('11. ERRO: Nenhum token CSRF disponível para teste!');
    }
    
  } catch (error) {
    console.error('ERRO no teste de CSRF:', error);
  }
  
  console.log('=== FIM DO TESTE ===');
}

// Exportar função para uso
if (typeof window !== 'undefined') {
  window.testCSRFToken = testCSRFToken;
}

export { testCSRFToken };