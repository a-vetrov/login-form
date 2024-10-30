import React, { useCallback, useMemo } from 'react'
import { CardContent, Typography } from '@mui/material'
import { getAccountAccessLevelInfo, getAccountStatusInfo, getAccountTypeInfo } from './utils'
import { format } from 'date-fns'
import { CardStyled } from './account-card.styles'
import { type ExtendedAccount } from '../../services/sandbox'
import { toMoneyString } from '../../utils/money'

interface Props {
  account: ExtendedAccount
  selected: boolean
  onClick: (id: string) => void
}

export const AccountCard: React.FC<Props> = ({ account, selected, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(account.id)
  }, [account.id, onClick])

  const freeTotal = useMemo(() => {
    return `Свободные средства: ${toMoneyString(account.portfolio.totalAmountCurrencies)}`
  }, [account.portfolio.totalAmountCurrencies])

  const total = useMemo(() => {
    return `Всего средств: ${toMoneyString(account.portfolio.totalAmountPortfolio)}`
  }, [account.portfolio.totalAmountPortfolio])

  return (
    <CardStyled sx={{ minWidth: 300, maxWidth: 300 }} raised={selected} onClick={handleClick}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color={selected ? 'primary.dark' : 'text.secondary'} gutterBottom>
          {getAccountTypeInfo(account.type)}
        </Typography>
        <Typography variant="h5">
          {account.name}
        </Typography>

        <Typography sx={{ my: 2 }}>
          {total}
        </Typography>
        <Typography sx={{ my: 2 }}>
          {freeTotal}
        </Typography>

        <Typography sx={{ my: 1 }} color="text.secondary" variant="body2">
          {getAccountStatusInfo(account.status)}
        </Typography>
        <Typography sx={{ my: 1 }} color="text.secondary" variant="body2">
          {getAccountAccessLevelInfo(account.accessLevel)}
        </Typography>

        {account.openedDate && (
          <Typography variant="body2">
            создан {format(account.openedDate, 'dd.MM.yyyy HH:mm')}
          </Typography>
        )}
      </CardContent>

    </CardStyled>
  )
}
