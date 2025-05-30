// ... existing code ...

const validateUsername = (username: string) => {
  if (!username) {
    return 'Nome de usuário é obrigatório';
  }
  
  // Permitir espaços, mas verificar comprimento e caracteres inválidos
  if (username.length < 3) {
    return 'Nome de usuário deve ter pelo menos 3 caracteres';
  }
  
  // Permitir letras, números, sublinhados e espaços
  if (!/^[\w\s]+$/.test(username)) {
    return 'Nome de usuário pode conter apenas letras, números, sublinhados e espaços';
  }
  
  return null;
};

// ... existing code ...