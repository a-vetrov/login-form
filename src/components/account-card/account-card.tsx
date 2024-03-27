import React, { useCallback } from 'react'
import { type Account } from '../../types/tinkoff/users.ts'
import { Card, CardContent, Typography } from '@mui/material'
import { getAccountAccessLevelInfo, getAccountStatusInfo, getAccountTypeInfo } from './utils.ts'
import { format } from 'date-fns'

interface Props {
  account: Account
  selected: boolean
  onClick: (id: string) => void
}

export const AccountCard: React.FC<Props> = ({ account, selected, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(account.id)
  }, [account.id, onClick])

  return (
    <Card sx={{ minWidth: 300, maxWidth: 300 }} raised={selected} onClick={handleClick}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {getAccountTypeInfo(account.type)}
        </Typography>
        <Typography variant="h5">
          {account.name}
        </Typography>

        <Typography sx={{ my: 2 }} color="text.secondary">
          {getAccountStatusInfo(account.status)}
        </Typography>
        <Typography sx={{ my: 2 }} color="text.secondary">
          {getAccountAccessLevelInfo(account.accessLevel)}
        </Typography>

        {account.openedDate && (
          <Typography variant="body2">
            создан {format(account.openedDate, 'dd.MM.yyyy HH:mm')}
          </Typography>
        )}
      </CardContent>

    </Card>
  )
}
