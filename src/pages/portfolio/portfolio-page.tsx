import React from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetPortfolioQuery } from '../../services/portfolio.ts'
import { ProductCard } from '../../components/product-card/product-card.tsx'

export const PortfolioPage: React.FC = () => {
  const { data, isLoading } = useGetPortfolioQuery()

  console.log({ data, isLoading })

  const positions = data?.portfolio.positions

  return (
    <>
      <MainToolbar />
      <h1>Ваш портфель</h1>
      {positions?.map((item) => <ProductCard data={item} key={item.figi} />)}
    </>
  )
}
