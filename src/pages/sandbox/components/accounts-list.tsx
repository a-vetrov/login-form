import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { AccountCard } from '../../../components/account-card/account-card'
import { type ExtendedAccount, sandboxApi } from '../../../services/sandbox'
import { NewMoneyDialog } from './new-money-dialog'

interface Props {
  accounts?: ExtendedAccount[]
  selectedAccount: string | undefined
  setSelectedAccount: (id: string) => void
  titleVisible?: boolean
  controlsVisible?: boolean
}

export const SandboxAccountsList: React.FC<Props> = ({
  accounts, selectedAccount,
  setSelectedAccount, titleVisible = true, controlsVisible = true
}) => {
  const [createTrigger, { isLoading: createIsLoading }] = sandboxApi.useCreateAccountMutation()
  const [deleteTrigger, { isLoading: deleteIsLoading }] = sandboxApi.useDeleteAccountMutation()
  const [newMoneyOpen, setNewMoneyOpen] = useState(false)

  useEffect(() => {
    if (selectedAccount === undefined && accounts?.[0]?.id) {
      setSelectedAccount(accounts[0].id)
    }
  }, [selectedAccount === undefined, accounts])

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
      void deleteTrigger(selectedAccount)
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
      {controlsVisible && <NewMoneyDialog open={newMoneyOpen} onClose={handleNewMoneyClose} id={selectedAccount}/>}
      {titleVisible && (
        <Typography variant="h3" marginTop={3}>
          Ваши счета
        </Typography>
      )}
      <Stack direction="row" spacing={2} marginY={2}>
        {accounts.map((item) => (
          <AccountCard account={item} key={item.id} selected={selectedAccount === item.id} onClick={setSelectedAccount} />
        ))}
      </Stack>
      {controlsVisible && (
        <Stack direction="row" spacing={2} marginY={2}>
          {addButton}
          {addMoneyButton}
          {deleteButton}
        </Stack>
      )}
    </>
  )
}
