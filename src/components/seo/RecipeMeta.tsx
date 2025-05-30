import { Metadata } from 'next'
import { Recipe } from '../../types/recipe'

interface GenerateMetadataProps {
  recipe: Recipe
  baseUrl: string
}

export function generateRecipeMetadata({ recipe, baseUrl }: GenerateMetadataProps): Metadata {
  const imageUrl = recipe.image.startsWith('http') 
    ? recipe.image 
    : `${baseUrl}${recipe.image}`

  return {
    title: `${recipe.title} | Vegan World`,
    description: recipe.description?.slice(0, 155) || 'Receita vegana deliciosa',
    openGraph: {
      title: recipe.title,
      description: recipe.description?.slice(0, 155) || 'Receita vegana deliciosa',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: recipe.title
        }
      ],
      type: 'article',
      authors: [recipe.author?.name || 'Vegan World'],
      publishedTime: recipe.createdAt,
      modifiedTime: recipe.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.description?.slice(0, 155) || 'Receita vegana deliciosa',
      images: [imageUrl],
    }
  }
}