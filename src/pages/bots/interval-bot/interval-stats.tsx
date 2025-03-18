import React, { useMemo } from 'react'
import { type OrderDataType } from '../../../services/bots'
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

interface Props {
  orders: OrderDataType[]
}

export const IntervalStats: React.FC<Props> = ({ orders }) => {
  const ordersLength = orders.length

  const stats = useMemo(() => {
    let executedOrdersLength = 0
    let lots = 0
    let lotsBuy = 0
    let priceBuy = 0
    let lotsSell = 0
    let priceSell = 0
    let commission = 0
    let serviceCommission = 0

    orders.forEach((order) => {
      const { status, direction, lotsExecuted, executedCommission, executedOrderPrice } = order
      if (status !== 1) {
        return
      }
      executedOrdersLength++

      if (direction === 1) {
        lotsBuy += lotsExecuted
        lots += lotsExecuted
        if (executedOrderPrice) {
          priceBuy += executedOrderPrice
        }
      } else {
        lotsSell += lotsExecuted
        lots -= lotsExecuted
        if (executedOrderPrice) {
          priceSell += executedOrderPrice
        }
      }

      if (executedCommission) {
        commission += executedCommission
      }

      if (order.serviceCommission) {
        serviceCommission += order.serviceCommission
      }
    })
    const saldo = priceSell - priceBuy
    const saldoIncludingCommission = saldo - commission - serviceCommission

    return {
      executedOrdersLength, lotsBuy, lotsSell, lots, commission, serviceCommission, priceBuy, priceSell, saldo, saldoIncludingCommission
    }
  }, [orders])

  return (
    <>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <StyledTableRow>
            <TableCell>Всего ордеров</TableCell>
            <TableCell align="right">{ordersLength}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Исполнено ордеров</TableCell>
            <TableCell align="right">{stats.executedOrdersLength}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Куплено лотов</TableCell>
            <TableCell align="right">{stats.lotsBuy}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Куплено лотов на сумму</TableCell>
            <TableCell align="right">{fromNumberToMoneyString(stats.priceBuy, 'RUB')}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Продано лотов</TableCell>
            <TableCell align="right">{stats.lotsSell}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Продано лотов на сумму</TableCell>
            <TableCell align="right">{fromNumberToMoneyString(stats.priceSell, 'RUB')}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Осталось нераспродано лотов</TableCell>
            <TableCell align="right">{stats.lots}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Стоимость нераспроданных лотов</TableCell>
            <TableCell align="right">...</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Сальдо</TableCell>
            <TableCell align="right">{fromNumberToMoneyString(stats.saldo, 'RUB')}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Комиссия</TableCell>
            <TableCell align="right">{fromNumberToMoneyString(stats.commission, 'RUB')}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Сервисная комиссия</TableCell>
            <TableCell align="right">{fromNumberToMoneyString(stats.serviceCommission, 'RUB')}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell>Сальдо с учетом всех комиссий</TableCell>
            <TableCell align="right">{fromNumberToMoneyString(stats.saldoIncludingCommission, 'RUB')}</TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}
