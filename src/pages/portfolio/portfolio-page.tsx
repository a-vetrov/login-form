import React, { useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetPortfolioQuery } from '../../services/portfolio.ts'
import { ProductCard } from '../../components/product-card/product-card.tsx'
import { AccountCard } from '../../components/account-card/account-card.tsx'
import { Container, Stack, Typography } from '@mui/material'
import { ErrorAlert } from '../../components/error-alert/error-alert.tsx'

export const PortfolioPage: React.FC = () => {
  const { data, error } = useGetPortfolioQuery()

  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)

  const positions = data?.portfolio.positions

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h1">
          Ваши продукты
        </Typography>
        <Typography variant="body1">
          Это ваши реальные счета и продукты.
        </Typography>
        <ErrorAlert error={error} />
        {data && (
          <>
            <Typography variant="h2" marginTop={3}>
              Ваши счета
            </Typography>
            <Stack direction="row" spacing={2} marginY={2}>
              {data?.accounts.map((item) => (
                <AccountCard account={item} key={item.id} selected={selectedAccount === item.id} onClick={setSelectedAccount} />
              ))}
            </Stack>

            <Typography variant="h2" marginTop={3}>
              Ваш портфель
            </Typography>
            <Typography variant="body1" marginBottom={2}>
              Пока что выводим портфель первого счета из списка
            </Typography>
            <Stack spacing={2} marginY={4}>
              {positions?.map((item) => <ProductCard data={item} key={item.figi} />)}
            </Stack>
          </>
        )}
      </Container>
    </>
  )
}
