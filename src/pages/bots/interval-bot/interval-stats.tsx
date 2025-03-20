import React, { useMemo } from 'react'
import { type BotStatisticsType } from '../../../services/bots'
import { fromNumberToMoneyString } from '../../../utils/money'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const dict = [
  {
    key: 'executedOrdersLength',
    title: 'Исполнено ордеров',
    type: 'number'
  },
  {
    key: 'lotsBuy',
    title: 'Куплено лотов',
    type: 'number'
  },
  {
    key: 'priceBuy',
    title: 'Куплено лотов на сумму',
    type: 'money'
  },
  {
    key: 'lotsSell',
    title: 'Продано лотов',
    type: 'number'
  },
  {
    key: 'priceSell',
    title: 'Продано лотов на сумму',
    type: 'money'
  },
  {
    key: 'lots',
    title: 'Осталось нераспродано лотов',
    type: 'number'
  },
  {
    key: 'commission',
    title: 'Комиссия',
    type: 'money'
  },
  {
    key: 'serviceCommission',
    title: 'Сервисная комиссия',
    type: 'money'
  },
  {
    key: 'lastPrice',
    title: 'Последняя цена продукта',
    type: 'money'
  },
  {
    key: 'currentPrice',
    title: 'Текущая цена продукта',
    type: 'money'
  }
]

interface Props {
  data: BotStatisticsType
}

export const IntervalStats: React.FC<Props> = ({ data }) => {
  const income = useMemo(() => {
    const { priceSell, priceBuy, lastPrice, currentPrice, product, lots } = data
    if (priceSell === undefined || priceBuy === undefined) {
      return undefined
    }
    const sum = priceSell - priceBuy
    const result: { last: number, current?: number } = { last: sum }

    if (lots && lastPrice !== undefined && product?.lot !== undefined) {
      result.last = sum + (lots * product.lot * lastPrice)
    }

    if (lots && currentPrice !== undefined && product?.lot !== undefined) {
      result.current = sum + (lots * product.lot * currentPrice)
    }
    return result
  }, [data])

  return (
    <>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {dict.map((item) => {
            const value = data[item.key as keyof BotStatisticsType] as unknown as number
            if (value !== undefined) {
              return (
                <StyledTableRow key={item.key}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell align="right">{item.type === 'money' ? fromNumberToMoneyString(value, 'RUB') : value}</TableCell>
                </StyledTableRow>
              )
            }
            return null
          })}
          {income?.last !== undefined && (
            <StyledTableRow>
              <TableCell>{income.current !== undefined ? 'Прибыль по последней цене' : 'Прибыль'}</TableCell>
              <TableCell align="right">{fromNumberToMoneyString(income.last, 'RUB')}</TableCell>
            </StyledTableRow>
          )}
          {income?.current !== undefined && (
            <StyledTableRow>
              <TableCell>{'Прибыль по текущей цене'}</TableCell>
              <TableCell align="right">{fromNumberToMoneyString(income.current, 'RUB')}</TableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}
