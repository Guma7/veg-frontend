'use client'

import Head from 'next/head'
import { Recipe } from '../../types/recipe'

interface RecipeSchemaProps {
  recipe: Recipe
}

export function RecipeSchema({ recipe }: RecipeSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.image,
    description: recipe.description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipe.averageRating,
      ratingCount: recipe.totalRatings
    },
    author: {
      '@type': 'Person',
      name: recipe.author?.name || 'Anonymous'
    }
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  )
}