import React, { useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetPortfolioQuery } from '../../services/portfolio.ts'
import { ProductCard } from '../../components/product-card/product-card.tsx'
import { AccountCard } from '../../components/account-card/account-card.tsx'
import { Container } from '@mui/material'

export const PortfolioPage: React.FC = () => {
  const { data, isLoading } = useGetPortfolioQuery()

  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)

  console.log({ data, isLoading })

  const positions = data?.portfolio.positions

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <h1>Ваши счета</h1>
        {data?.accounts.map((item) => (
          <AccountCard account={item} key={item.id} selected={selectedAccount === item.id} onClick={setSelectedAccount} />
        ))}

        <h1>Ваш портфель</h1>
        {positions?.map((item) => <ProductCard data={item} key={item.figi} />)}
      </Container>
    </>
  )
}
