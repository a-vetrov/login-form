import React, { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { sandboxApi } from '../../services/sandbox'
import { ErrorAlert } from '../../components/error-alert/error-alert'
import { SandboxAccountsList } from './components/accounts-list'
import { ProductCard } from '../../components/product-card/product-card'

export const SandboxPage: React.FC = () => {
  const accounts = sandboxApi.useGetAccountsQuery()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)
  const { data } = sandboxApi.useGetSandboxPortfolioQuery(selectedAccount, { skip: !selectedAccount })

  return (
    <>
      <Typography variant="h1">
        Песочница
      </Typography>
      <Typography variant="body1">
        Здесь можно управлять виртуальными брокерскими счетами без проведения операций по реальной покупке/продаже продуктов.
      </Typography>
      <ErrorAlert error={accounts.error} />
      <SandboxAccountsList accounts={accounts.data?.accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
      {
        selectedAccount && (
          <>
            <Typography variant="h2" marginTop={3}>
              Ваш виртуальный портфель
            </Typography>
            <Stack spacing={2} marginY={4}>
              {data?.positions?.map((item) => <ProductCard data={item} key={item.figi} />)}
            </Stack>
          </>
        )
      }
    </>
  )
}
