import React from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetPortfolioQuery } from '../../services/portfolio.ts'

export const PortfolioPage: React.FC = () => {
  const { data, isLoading } = useGetPortfolioQuery()

  console.log({ data, isLoading })

  return (
    <>
      <MainToolbar />
      <h1>Ваш портфель</h1>

    </>
  )
}

