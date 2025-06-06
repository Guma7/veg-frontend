'use client'

import styled from 'styled-components'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

// Definir a variável API_URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://veg-backend-rth1.onrender.com';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const StatsContainer = styled.div`
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const StatCard = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.hover};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
`

const ChartContainer = styled.div`
  height: 300px;
  margin-top: ${props => props.theme.spacing.xl};
`

export function RecipeStats() {
  interface ViewData {
    date: string;
    views: number;
  }

  interface Stats {
    totalViews: number;
    averageRating: number;
    totalComments: number;
    viewsOverTime: ViewData[];
    ratingsDistribution: number[];
  }

  const [stats, setStats] = useState<Stats>({
    totalViews: 0,
    averageRating: 0,
    totalComments: 0,
    viewsOverTime: [],
    ratingsDistribution: []
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recipes/stats/`, {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }

    fetchStats()
  }, [])

  const viewsData = {
    labels: stats.viewsOverTime.map(item => item.date),
    datasets: [{
      label: 'Visualizações',
      data: stats.viewsOverTime.map(item => item.views),
      borderColor: '#4CAF50',
      tension: 0.1
    }]
  }

  const ratingsData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [{
      label: 'Distribuição de Avaliações',
      data: stats.ratingsDistribution,
      backgroundColor: '#2196F3'
    }]
  }

  return (
    <StatsContainer>
      <h2>Estatísticas da Receita</h2>
      
      <StatsGrid>
        <StatCard>
          <h3>Total de Visualizações</h3>
          <p>{stats.totalViews}</p>
        </StatCard>
        
        <StatCard>
          <h3>Avaliação Média</h3>
          <p>{stats.averageRating.toFixed(1)} ★</p>
        </StatCard>
        
        <StatCard>
          <h3>Total de Comentários</h3>
          <p>{stats.totalComments}</p>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <Line data={viewsData} options={{ responsive: true, maintainAspectRatio: false }} />
      </ChartContainer>

      <ChartContainer>
        <Bar data={ratingsData} options={{ responsive: true, maintainAspectRatio: false }} />
      </ChartContainer>
    </StatsContainer>
  )
}