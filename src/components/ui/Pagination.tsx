'use client'

import styled from 'styled-components'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin: ${props => props.theme.spacing.xl} 0;
`

const PageButton = styled.button<{ active?: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text.inverse : props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  min-width: 40px;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.hover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PageEllipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  min-width: 40px;
`

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Não renderizar paginação se houver apenas uma página
  if (totalPages <= 1) return null;
  
  const renderPageButtons = () => {
    const buttons = [];
    
    // Lógica para mostrar um número limitado de botões quando há muitas páginas
    if (totalPages <= 7) {
      // Se houver 7 ou menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PageButton
            key={i}
            active={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PageButton>
        );
      }
    } else {
      // Sempre mostrar a primeira página
      buttons.push(
        <PageButton 
          key={1} 
          active={currentPage === 1} 
          onClick={() => onPageChange(1)}
        >
          1
        </PageButton>
      );
      
      // Lógica para mostrar elipses e páginas intermediárias
      if (currentPage > 3) {
        buttons.push(<PageEllipsis key="ellipsis-1">...</PageEllipsis>);
      }
      
      // Páginas ao redor da página atual
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          buttons.push(
            <PageButton 
              key={i} 
              active={currentPage === i} 
              onClick={() => onPageChange(i)}
            >
              {i}
            </PageButton>
          );
        }
      }
      
      if (currentPage < totalPages - 2) {
        buttons.push(<PageEllipsis key="ellipsis-2">...</PageEllipsis>);
      }
      
      // Sempre mostrar a última página
      buttons.push(
        <PageButton 
          key={totalPages} 
          active={currentPage === totalPages} 
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PageButton>
      );
    }
    
    return buttons;
  };
  
  return (
    <PaginationContainer>
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </PageButton>
      
      {renderPageButtons()}
      
      <PageButton 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </PageButton>
    </PaginationContainer>
  )
}