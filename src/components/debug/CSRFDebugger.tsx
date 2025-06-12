'use client'
import React, { useState } from 'react';
import { fetchCSRFToken } from '../../services/auth';

interface CSRFTestResult {
  step: string;
  success: boolean;
  data?: any;
  error?: string;
}

const CSRFDebugger: React.FC = () => {
  const [results, setResults] = useState<CSRFTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: CSRFTestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testCSRFFlow = async () => {
    setIsLoading(true);
    clearResults();

    try {
      // Passo 1: Verificar cookies iniciais
      addResult({
        step: '1. Cookies iniciais',
        success: true,
        data: document.cookie || 'Nenhum cookie encontrado'
      });

      // Passo 2: Obter token CSRF
      addResult({
        step: '2. Obtendo token CSRF...',
        success: true,
        data: 'Iniciando requisição'
      });

      const token = await fetchCSRFToken();
      
      if (token) {
        addResult({
          step: '3. Token CSRF obtido',
          success: true,
          data: {
            token: token,
            length: token.length,
            type: typeof token,
            isValid: token.length >= 32
          }
        });
      } else {
        addResult({
          step: '3. Token CSRF',
          success: false,
          error: 'Token vazio ou não obtido'
        });
      }

      // Passo 3: Verificar cookies após requisição
      addResult({
        step: '4. Cookies após requisição',
        success: true,
        data: document.cookie || 'Nenhum cookie encontrado'
      });

      // Passo 4: Testar requisição com token
      if (token) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';
          const testResponse = await fetch(`${API_URL}/api/auth/me/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'X-Csrftoken': token,
              'Accept': 'application/json'
            }
          });

          addResult({
            step: '5. Teste de requisição com token',
            success: testResponse.ok,
            data: {
              status: testResponse.status,
              statusText: testResponse.statusText,
              headers: Object.fromEntries(testResponse.headers.entries())
            }
          });

          if (!testResponse.ok) {
            const errorText = await testResponse.text();
            addResult({
              step: '6. Erro da requisição',
              success: false,
              error: errorText
            });
          }
        } catch (error) {
          addResult({
            step: '5. Teste de requisição',
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          });
        }
      }

    } catch (error) {
      addResult({
        step: 'Erro geral',
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔍 CSRF Token Debugger</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testCSRFFlow}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isLoading ? 'Testando...' : 'Testar CSRF Token'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Limpar Resultados
        </button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {results.map((result, index) => (
          <div 
            key={index}
            style={{
              padding: '10px',
              margin: '5px 0',
              border: `1px solid ${result.success ? '#28a745' : '#dc3545'}`,
              borderRadius: '4px',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da'
            }}
          >
            <strong>{result.step}</strong>
            {result.success ? (
              <div style={{ marginTop: '5px' }}>
                <span style={{ color: '#155724' }}>✅ Sucesso</span>
                {result.data && (
                  <pre style={{ 
                    marginTop: '5px', 
                    fontSize: '12px', 
                    backgroundColor: 'white', 
                    padding: '5px',
                    borderRadius: '3px',
                    overflow: 'auto'
                  }}>
                    {typeof result.data === 'object' 
                      ? JSON.stringify(result.data, null, 2) 
                      : result.data
                    }
                  </pre>
                )}
              </div>
            ) : (
              <div style={{ marginTop: '5px' }}>
                <span style={{ color: '#721c24' }}>❌ Erro</span>
                {result.error && (
                  <div style={{ 
                    marginTop: '5px', 
                    fontSize: '12px', 
                    color: '#721c24',
                    backgroundColor: 'white',
                    padding: '5px',
                    borderRadius: '3px'
                  }}>
                    {result.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#6c757d', 
          fontStyle: 'italic',
          padding: '20px'
        }}>
          Clique em "Testar CSRF Token" para iniciar o diagnóstico
        </div>
      )}
    </div>
  );
};

export default CSRFDebugger;