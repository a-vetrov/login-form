import React, { useCallback, useMemo, useState } from 'react'
import type { Account } from '../../../types/tinkoff/users.ts'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { AccountCard } from '../../../components/account-card/account-card'
import { sandboxApi } from '../../../services/sandbox'
import { NewMoneyDialog } from './new-money-dialog'

interface Props {
  accounts?: Account[]
  selectedAccount: string | undefined
  setSelectedAccount: (id: string) => void
}

export const SandboxAccountsList: React.FC<Props> = ({ accounts, selectedAccount, setSelectedAccount }) => {
  const [createTrigger, { isLoading: createIsLoading }] = sandboxApi.useCreateAccountMutation()
  const [deleteTrigger, { isLoading: deleteIsLoading }] = sandboxApi.useDeleteAccountMutation()
  const [newMoneyOpen, setNewMoneyOpen] = useState(false)

  const handleNewMoneyClose = useCallback(() => {
    setNewMoneyOpen(false)
  }, [setNewMoneyOpen])

  const addButton = useMemo(() => {
    const clickHandler = (): void => {
      void createTrigger()
    }
    return (
      <Button
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        disabled={createIsLoading}
        onClick={clickHandler}
      >
        Добавить виртуальный счет
      </Button>
    )
  }, [createTrigger, createIsLoading])

  const deleteButton = useMemo(() => {
    if (!selectedAccount) {
      return null
    }

    const clickHandler = (): void => {
      deleteTrigger(selectedAccount)
    }

    return (
      <Button
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        onClick={clickHandler}
        disabled={deleteIsLoading}
      >
        Удалить выбранный счет
      </Button>
    )
  }, [selectedAccount, deleteIsLoading, deleteTrigger])

  const addMoneyButton = useMemo(() => {
    if (!selectedAccount) {
      return null
    }

    const clickHandler = (): void => {
      setNewMoneyOpen(true)
    }

    return (
      <Button
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        onClick={clickHandler}
      >
        Добавить денег
      </Button>
    )
  }, [selectedAccount, setNewMoneyOpen])

  if (!accounts) {
    return null
  }

  if (accounts.length === 0) {
    return (
      <>
        <Box marginTop={2}>
          <Alert severity="info">
            У вас пока что ни одного виртуального брокерского счета
          </Alert>
        </Box>
        {addButton}
      </>
    )
  }

  return (
    <>
      <NewMoneyDialog open={newMoneyOpen} onClose={handleNewMoneyClose} id={selectedAccount}/>
      <Typography variant="h3" marginTop={3}>
        Ваши счета
      </Typography>
      <Stack direction="row" spacing={2} marginY={2}>
        {accounts.map((item) => (
          <AccountCard account={item} key={item.id} selected={selectedAccount === item.id} onClick={setSelectedAccount} />
        ))}
      </Stack>
      <Stack direction="row" spacing={2} marginY={2}>
        {addButton}
        {addMoneyButton}
        {deleteButton}
      </Stack>
    </>
  )
}
