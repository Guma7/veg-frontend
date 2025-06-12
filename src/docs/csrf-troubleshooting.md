# 🔧 Guia de Solução de Problemas CSRF

## 📋 Problemas Identificados e Soluções

### 1. ✅ **Cookie csrftoken ausente ou inválido** - RESOLVIDO

**Problema:** O frontend busca o token CSRF via `Cookies.get('csrftoken')`, mas o cookie pode estar ausente, corrompido ou com nome incorreto.

**Soluções Implementadas:**
- ✅ Padronização do nome do cookie para `csrftoken` (minúsculas) em todos os arquivos
- ✅ Função `getCSRFToken()` melhorada com logs detalhados
- ✅ Verificação de variações do nome do cookie (`CSRFToken`, `csrf_token`, etc.)
- ✅ Validação do comprimento e tipo do token

**Arquivos Corrigidos:**
- `auth.ts` - Função principal de obtenção do token
- `receitas/nova/page.tsx`
- `receitas/editar/[slug]/page.tsx` 
- `receitas/criar/page.tsx`
- `profile/page.tsx`
- `Comments.tsx`
- `EditProfileModal.tsx`
- `profile/[username]/page.tsx`

### 2. ✅ **Requisições POST antes de obter csrftoken** - VERIFICADO

**Problema:** O token CSRF é enviado via Set-Cookie quando o frontend faz uma requisição GET inicial. Se você for direto ao POST, o token não foi recebido ainda.

**Soluções Implementadas:**
- ✅ Função `fetchCSRFToken()` faz requisição GET para `/api/auth/csrf/` antes de qualquer POST
- ✅ Token obtido tanto da resposta JSON quanto dos cookies
- ✅ Logs detalhados para rastrear o fluxo de obtenção do token

### 3. ✅ **withCredentials: true** - VERIFICADO

**Problema:** O cookie do token CSRF não chega se `credentials: 'include'` não estiver habilitado.

**Status:** ✅ **CORRETO** - Todas as requisições fetch estão usando `credentials: 'include'`

**Arquivos Verificados:**
- Todas as requisições em `auth.ts` ✅
- Todas as páginas de receitas ✅
- Componentes de perfil ✅
- Sistema de comentários ✅

### 4. 🔍 **Problemas Adicionais Identificados**

#### A. Configuração de Domínio CORS
**Backend configurado para:**
- `CORS_ALLOW_CREDENTIALS = True` ✅
- Headers CSRF expostos: `X-CSRFToken`, `x-csrftoken` ✅
- Middleware de normalização de headers ✅

#### B. Configuração de Cookies CSRF
**Backend configurado para:**
- `CSRF_COOKIE_SAMESITE = 'None'` ✅
- `CSRF_COOKIE_SECURE = True` ✅
- `CSRF_COOKIE_AGE = 31449600` (1 ano) ✅

#### C. Headers de Requisição
**Frontend configurado para:**
- Header: `X-Csrftoken` (minúscula no final) ✅
- Backend aceita: `X-CSRFToken`, `X-Csrftoken` ✅

## 🛠️ Ferramentas de Debug Criadas

### 1. CSRFDebugger Component
**Localização:** `src/components/debug/CSRFDebugger.tsx`

**Funcionalidades:**
- Testa todo o fluxo de obtenção do token CSRF
- Mostra cookies antes e depois das requisições
- Valida comprimento e tipo do token
- Testa requisição real com o token obtido
- Interface visual com resultados detalhados

### 2. Script de Teste JavaScript
**Localização:** `src/debug/csrf-test.js`

**Funcionalidades:**
- Função `testCSRFToken()` para console do navegador
- Logs detalhados de cada etapa
- Verificação de cookies e headers
- Teste de requisição POST

## 📊 Logs Melhorados

### Função `fetchCSRFToken()`
- ✅ URL da API
- ✅ Cookies antes da requisição
- ✅ Status e headers da resposta
- ✅ Token da resposta JSON
- ✅ Token dos cookies
- ✅ Validação de comprimento
- ✅ Avisos para tokens muito curtos

### Função `getCSRFToken()`
- ✅ Todos os cookies disponíveis
- ✅ Cookies separados individualmente
- ✅ Busca por variações do nome
- ✅ Validação de token inválido
- ✅ Tipo e comprimento do token

## 🔍 Como Usar as Ferramentas de Debug

### No Navegador (Console):
```javascript
// Importar e executar teste
import { testCSRFToken } from './src/debug/csrf-test.js';
testCSRFToken();

// Ou se disponível globalmente
window.testCSRFToken();
```

### No React (Componente):
```jsx
import CSRFDebugger from './src/components/debug/CSRFDebugger';

// Adicionar em qualquer página para debug
<CSRFDebugger />
```

## 🎯 Próximos Passos para Diagnóstico

1. **Usar o CSRFDebugger** em uma página de teste
2. **Verificar os logs** no console do navegador
3. **Analisar a resposta** do endpoint `/api/auth/csrf/`
4. **Verificar se o token** está sendo definido corretamente nos cookies
5. **Testar requisições** com o token obtido

## 🚨 Sinais de Problemas

- Token com comprimento < 32 caracteres
- Cookie `csrftoken` não aparece após requisição GET
- Erro 403 Forbidden em requisições POST
- Token `undefined`, `null` ou string vazia
- Headers CORS não permitindo cookies

## ✅ Verificações Finais

- [ ] Backend retorna token válido em `/api/auth/csrf/`
- [ ] Cookie `csrftoken` é definido após requisição GET
- [ ] Frontend extrai token corretamente dos cookies
- [ ] Requisições POST incluem header `X-Csrftoken`
- [ ] Todas as requisições usam `credentials: 'include'`
- [ ] CORS configurado para permitir cookies cross-origin