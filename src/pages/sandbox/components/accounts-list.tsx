import React, { useMemo } from 'react'
import type { Account } from '../../../types/tinkoff/users.ts'
import {Alert, Box, Button, Stack, Typography} from '@mui/material'
import { AccountCard } from '../../../components/account-card/account-card.tsx'
import { sandboxApi } from '../../../services/sandbox.ts'

interface Props {
  accounts?: Account[]
  selectedAccount: string | undefined
  setSelectedAccount: (id: string) => void
}

export const SandboxAccountsList: React.FC<Props> = ({ accounts, selectedAccount, setSelectedAccount }) => {
  const [createTrigger, { isLoading: createIsLoading }] = sandboxApi.useCreateAccountMutation()
  const [deleteTrigger, { isLoading: deleteIsLoading }] = sandboxApi.useDeleteAccountMutation()

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
    const clickHandler = (): void => {
      deleteTrigger(selectedAccount as string)
    }

    if (!selectedAccount) {
      return null
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
        {deleteButton}
      </Stack>
    </>
  )
}
