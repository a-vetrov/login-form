import React, { useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, Typography } from '@mui/material'
import { sandboxApi } from '../../services/sandbox.ts'
import { ErrorAlert } from '../../components/error-alert/error-alert.tsx'
import { SandboxAccountsList } from './components/accounts-list.tsx'

export const SandboxPage: React.FC = () => {
  const accounts = sandboxApi.useGetAccountsQuery()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2">
          Песочница
        </Typography>
        <Typography variant="body1">
          Здесь можно управлять виртуальными брокерскими счетами без проведения операций по реальной покупке/продаже продуктов.
        </Typography>
        <ErrorAlert error={accounts.error} />
        <SandboxAccountsList accounts={accounts.data?.accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} />
      </Container>
    </>
  )
}
