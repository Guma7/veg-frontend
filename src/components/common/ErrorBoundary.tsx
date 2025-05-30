'use client'
import React from 'react'
import styled from 'styled-components'

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 4px;
  background: ${props => props.theme.colors.errorBg};
`

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}