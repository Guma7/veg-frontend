export const RECIPE_VALIDATION = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s.,!?()-]+$/
  },
  class: {
    required: true,
    values: ['Entrada', 'Prato Principal', 'Sobremesa', 'Lanche', 'Aniversário Vegano', 'Suco', 'Drink', 'Veg Frios', 'Veg Carnes'] as const
  },
  style: {
    required: true,
    values: ['Gourmet', 'Caseira'] as const
  },
  genre: {
    required: true,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s]+$/
  },
  description: {
    maxLength: 2000,
    pattern: /^[a-zA-ZÀ-ÿ0-9\s.,!?()-]+$/
  },
  youtubeUrl: {
    pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
  },
  instructions: {
    minLength: 30,
    maxLength: 5000
  },
  ingredients: {
    minLength: 10,
    maxLength: 2000
  },
}

export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
}

import { Recipe } from '../types/recipe'

export function validateRecipe(recipe: Partial<Recipe>): ValidationResult {
  const errors: Record<string, string> = {};

  // Validação de campos obrigatórios
  if (RECIPE_VALIDATION.title.required && !recipe.title) {
    errors.title = 'Título é obrigatório';
  }

  if (RECIPE_VALIDATION.class.required && !recipe.class) {
    errors.class = 'Classe é obrigatória';
  }

  // Style validation
  if (!recipe.style || !RECIPE_VALIDATION.style.values.includes(recipe.style)) {
    errors.style = 'Selecione um estilo válido'
  }

  // Genre validation
  //if (!recipe.genre || !RECIPE_VALIDATION.genre.values.includes(recipe.genre)) {
  //  errors.genre = 'Selecione um gênero válido'
  //}
  if (!recipe.genre) {
    errors.genre = 'Gênero é obrigatório';
  }


  // YouTube URL validation
  if (recipe.youtubeUrl && !validateYouTubeUrl(recipe.youtubeUrl)) {
    errors.youtubeUrl = 'URL do YouTube inválida'
  }

  // Ingredients validation
  if (recipe.ingredients) {
    if (recipe.ingredients.length < RECIPE_VALIDATION.ingredients.minLength) {
      errors.ingredients = `Mínimo de ${RECIPE_VALIDATION.ingredients.minLength} caracteres`
    }
    if (recipe.ingredients.length > RECIPE_VALIDATION.ingredients.maxLength) {
      errors.ingredients = `Máximo de ${RECIPE_VALIDATION.ingredients.maxLength} caracteres`
    }
  }

  // Instructions validation
  if (recipe.instructions) {
    if (recipe.instructions.length < RECIPE_VALIDATION.instructions.minLength) {
      errors.instructions = `Mínimo de ${RECIPE_VALIDATION.instructions.minLength} caracteres`
    }
    if (recipe.instructions.length > RECIPE_VALIDATION.instructions.maxLength) {
      errors.instructions = `Máximo de ${RECIPE_VALIDATION.instructions.maxLength} caracteres`
    }
  }

  // Validação de formato e tamanho (apenas se o campo existir)
  if (recipe.title) {
    if (recipe.title.length < RECIPE_VALIDATION.title.minLength) {
      errors.title = `Mínimo de ${RECIPE_VALIDATION.title.minLength} caracteres`;
    }
  }

  // Validação de valores permitidos
  //if (recipe.class && !RECIPE_VALIDATION.class.values.includes(recipe.class)) {
  //  errors.class = 'Selecione uma classe válida';
  //}


  // Validação de imagens
  if (!recipe.images || recipe.images.length === 0) {
    errors.images = 'Pelo menos uma imagem é obrigatória';
  } else if (recipe.images.length > 5) {
    errors.images = 'Máximo de 5 imagens permitidas';
  }
  
  // Informação sobre campos obrigatórios
  // Apenas os campos 1 (título), 2 (classe), 3 (gênero), 4 (estilo), 8 (ingredientes) e 9 (modo de preparo) são obrigatórios

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Helper function para validar números
function validateNumber(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value < min) return `${fieldName} deve ser no mínimo ${min}`;
  if (value > max) return `${fieldName} deve ser no máximo ${max}`;
  return null;
}

// Atualizar validação do YouTube para ser mais flexível
export function validateYouTubeUrl(url: string | undefined): boolean {
  if (!url) return true;
  return RECIPE_VALIDATION.youtubeUrl.pattern.test(url);
}