import React, { useEffect, useMemo, useState } from 'react'
import { useGetPortfolioQuery } from '../../services/portfolio'
import { ProductCard } from '../../components/product-card/product-card'
import { AccountCard } from '../../components/account-card/account-card'
import { Stack, Typography } from '@mui/material'
import { ErrorAlert } from '../../components/error-alert/error-alert'

export const PortfolioPage: React.FC = () => {
  const { data, error } = useGetPortfolioQuery()

  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)

  useEffect(() => {
    const id = data?.accounts?.[0]?.id
    if (selectedAccount === undefined && id) {
      setSelectedAccount(id)
    }
  }, [selectedAccount === undefined, data?.accounts])

  const positions = useMemo(() => {
    const account = data?.accounts.find(item => item.id === selectedAccount)
    if (!account) {
      return undefined
    }
    return account.portfolio.positions
  }, [data?.accounts, selectedAccount])

  return (
    <>
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
    </>
  )
}
