'use client'

import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { RecipeFilters, RecipeFiltersType } from '../../components/recipe/RecipeFilters'
import { RecipeCard } from '../../components/recipe/RecipeCard'
import { Pagination } from '../../components/ui/Pagination'
import { debounce } from 'lodash'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`

const RecipesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
`

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.text.secondary};
`

const RecipesCount = styled.div`
  text-align: right;
  margin-top: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fonts.sizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`

interface Recipe {
  id: string
  title: string
  image: string
  image_url?: string
  slug?: string
  recipeClass: string
  style: string
  genre: string
  nutritionalLevel?: string
  doesNotContain?: string
  traditional?: string
  ingredients: string[]
  averageRating: number
}

interface RecipesResponse {
  results: Recipe[]
  similar_results?: Recipe[]
  count: number
  total_pages: number
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecipes, setTotalRecipes] = useState(0)
  const [currentFilters, setCurrentFilters] = useState<RecipeFiltersType>({
    generalSearch: '',
    title: '',
    recipeClass: '',
    genre: '',
    style: '',
    nutritionalLevel: '',
    doesNotContain: '',
    traditional: '',
    ingredients: []
  })
  const ITEMS_PER_PAGE = 30

  // Implementação da função fetchRecipes com cache de requisições recentes
  const fetchRecipesImpl = async (filters: RecipeFiltersType, page: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: filters.generalSearch || filters.title || '',
        recipe_class: filters.recipeClass || '',
        style: filters.style || '',
        genre: filters.genre || '',
        nutritional_level: filters.nutritionalLevel || '',
        does_not_contain: filters.doesNotContain || '',
        traditional: filters.traditional || '',
        ingredients: filters.ingredients?.join(',') || '',
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })

      // Adicionar um timestamp para evitar cache do navegador
      const requestUrl = `http://127.0.0.1:8000/api/recipes/search/?${params}`
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data: RecipesResponse = await response.json()
        setRecipes(data.results)
        setSimilarRecipes(data.similar_results || [])
        setTotalPages(data.total_pages || Math.ceil(data.count / ITEMS_PER_PAGE))
        setTotalRecipes(data.count || 0)
      } else {
        console.error('Erro na resposta da API:', await response.text())
        setRecipes([])
        setTotalRecipes(0)
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
      setRecipes([])
      setTotalRecipes(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  // Versão com debounce da função fetchRecipes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRecipes = useCallback(
    debounce((filters: RecipeFiltersType, page: number = 1) => {
      fetchRecipesImpl(filters, page)
    }, 300),
    []
  )
  
  // Limpar o debounce quando o componente for desmontado
  useEffect(() => {
    return () => {
      fetchRecipes.cancel()
    }
  }, [fetchRecipes])

  const handleFilterChange = (filters: RecipeFiltersType) => {
    setCurrentFilters(filters)
    setCurrentPage(1) // Resetar para a primeira página quando os filtros mudam
    fetchRecipes(filters, 1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchRecipes(currentFilters, page)
    // Rolar para o topo da página quando mudar de página
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Carregar receitas automaticamente quando a página for carregada
  useEffect(() => {
    // Pequeno atraso para evitar múltiplas chamadas durante a inicialização
    const timer = setTimeout(() => {
      fetchRecipes(currentFilters, 1)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [fetchRecipes, currentFilters])

  return (
    <Container>
      <RecipeFilters onFilterChange={handleFilterChange} />
      
      {loading ? (
        <LoadingContainer>Carregando receitas...</LoadingContainer>
      ) : recipes.length > 0 ? (
        <>
          <RecipesCount>
            Mostrando {recipes.length} de {totalRecipes} receitas
          </RecipesCount>
          <RecipesGrid>
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={{
                id: recipe.id,
                title: recipe.title,
                slug: recipe.slug,
                image: recipe.image_url || recipe.image,
                rating: recipe.averageRating
              }} />
            ))}
          </RecipesGrid>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <NoResults>
          <h3>Nenhuma receita encontrada com estes filtros</h3>
          {similarRecipes.length > 0 && (
            <>
              <p>Receitas similares que podem te interessar:</p>
              <RecipesGrid>
                {similarRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={{
                    id: recipe.id,
                    title: recipe.title,
                    slug: recipe.slug,
                    image: recipe.image_url || recipe.image,
                    rating: recipe.averageRating
                  }} />
                ))}
              </RecipesGrid>
            </>
          )}
        </NoResults>
      )}
    </Container>
  )
}