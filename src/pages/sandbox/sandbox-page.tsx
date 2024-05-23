import React, {useEffect, useState} from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, Typography } from '@mui/material'
import { sandboxApi } from '../../services/sandbox'
import { ErrorAlert } from '../../components/error-alert/error-alert'
import { SandboxAccountsList } from './components/accounts-list'

export const SandboxPage: React.FC = () => {
  const accounts = sandboxApi.useGetAccountsQuery()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (selectedAccount === undefined && accounts.data?.accounts[0]?.id) {
      setSelectedAccount(accounts.data.accounts[0].id)
    }
  }, [selectedAccount === undefined, accounts.data?.accounts[0]?.id])

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
