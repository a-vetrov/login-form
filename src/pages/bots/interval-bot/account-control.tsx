import React, { useCallback, useEffect, useMemo } from 'react'
import {CircularProgress, Stack, ToggleButtonGroup, Typography, Box, ToggleButton} from '@mui/material'
import { AccountTypes } from '../../../constants'
import { sandboxApi } from '../../../services/sandbox'
import { useGetPortfolioQuery } from '../../../services/portfolio'
import { ErrorAlert } from '../../../components/error-alert/error-alert'
import { AccountCard } from '../../../components/account-card/account-card'
import {getFromMoneyValue} from '../../../utils/money';

interface Props {
  accountType: AccountTypes
  onChangeAccountType: (newValue: AccountTypes) => void
  selectedAccount?: string
  onChangeSelectedAccount: (newValue?: string) => void
  budget: number
}

export const AccountControl: React.FC<Props> = ({ accountType, onChangeAccountType, selectedAccount, onChangeSelectedAccount, budget }) => {
  const sandboxAccounts = sandboxApi.useGetAccountsQuery()
  const realAccounts = useGetPortfolioQuery()

  const accounts = accountType === AccountTypes.real ? realAccounts : sandboxAccounts

  const handleTypeChange = useCallback((_event: React.MouseEvent, value: string) => {
    onChangeAccountType(value as AccountTypes)
  }, [onChangeAccountType])

  useEffect(() => {
    onChangeSelectedAccount(accounts.data?.accounts[0].id)
  }, [accounts, onChangeSelectedAccount])

  const errorMessage = useMemo(() => {
    const account = accounts.data?.accounts.find(({ id }) => id === selectedAccount)
    if (!account) {
      return null
    }
    const freeMoney = getFromMoneyValue(account.portfolio.totalAmountCurrencies) ?? 0
    if (freeMoney < budget) {
      return (
        <Typography variant="body1" color='error'>
          На счету недостаточно средств.
        </Typography>
      )
    }
  }, [accounts.data?.accounts, budget, selectedAccount])

  if (accounts.isLoading) {
    return <CircularProgress />
  }

  return (
    <>
      <Typography variant="body1" marginBottom={1}>
        Потестируем в песочнице или торгуем на реальном брокерском счете?
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={accountType}
        exclusive
        onChange={handleTypeChange}
        aria-label="Platform"
      >
        <ToggleButton value={AccountTypes.sandbox}>Песочница</ToggleButton>
        <ToggleButton value={AccountTypes.real}>Реальный счет</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="body1" marginTop={3}>
        Ваши счета:
      </Typography>
      <ErrorAlert error={accounts.error} />
      <Box sx={{overflowX: 'auto', maxWidth: '100%'}}>
        <Stack direction="row" spacing={2} marginY={2}>
          {accounts.data?.accounts.map((item) => (
            <AccountCard account={item} key={item.id} selected={selectedAccount === item.id} onClick={onChangeSelectedAccount} />
          ))}
        </Stack>
      </Box>

      {errorMessage}

    </>
  )
}
