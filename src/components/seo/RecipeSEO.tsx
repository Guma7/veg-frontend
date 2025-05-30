'use client'

import Head from 'next/head'

interface RecipeSEOProps {
  title: string;
  description: string;
  image: string;
  author: string;
  publishedTime: string;
}

export function RecipeSEO({ title, description, image, author, publishedTime }: RecipeSEOProps) {
  const siteTitle = `${title} | Vegan World`

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="article" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: title,
          author: {
            '@type': 'Person',
            name: author
          },
          datePublished: publishedTime,
          image,
          description
        })}
      </script>
    </Head>
  )
}