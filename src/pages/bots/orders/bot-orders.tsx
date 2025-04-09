import React, { useMemo } from 'react'
import { type OrderDataType, type OrdersListDataType } from '../../../services/bots'
import { Accordion, AccordionDetails, AccordionSummary, TableHead, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableContainer from '@mui/material/TableContainer'
import { getColorSx, getOrderDirection, sortByDate } from './utils'
import { fromNumberToMoneyString } from '../../../utils/money'
import { format } from 'date-fns'

interface Props {
  data: OrdersListDataType
}

const accordionMargin = { marginY: 4 }

export const BotOrders: React.FC<Props> = ({ data }) => {
  const orderStepMap = useMemo(() => {
    if (!data?.steps) {
      return undefined
    }

    return data.steps.reduce<Record<string, number>>((accumulator, item) => {
      item.orders.forEach((id) => {
        accumulator[id] = item.serialNumber
      })
      return accumulator
    }, {})
  }, [data?.steps])

  const ordersMap = useMemo(() => {
    if (!data?.orders) {
      return undefined
    }

    return data.orders.reduce<Record<string, OrderDataType>>((accumulator, item) => {
      accumulator[item.orderId] = item
      return accumulator
    }, {})
  }, [data?.orders])

  const orders = useMemo(() => {
    if (!data?.steps || !data.orders || !orderStepMap || !ordersMap) {
      return undefined
    }

    return data.orders.slice().sort(sortByDate).map((item) => {
      const commission = item.executedCommission || item.initialCommission
      let profit: number | undefined
      try {
        if (item.direction === 2) {
          const serialNumber = orderStepMap[item.orderId]
          const arr = data.steps[serialNumber].orders
          const index = arr.indexOf(item.orderId) - 1
          const prevId = arr[index]
          const prevOrder = ordersMap[prevId]
          profit = item.executedOrderPrice - prevOrder.executedOrderPrice - commission
        }
      } catch (e) {}

      return {
        ...item,
        profit,
        commission
      }
    })
  }, [data, orderStepMap, ordersMap])

  return (
      <Accordion sx={accordionMargin}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="h2">Список ордеров ({data?.orders.length} шт.)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Шаг</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Комиссия</TableCell>
                  <TableCell>Профит</TableCell>
                  <TableCell>Дата исполнения</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={order.orderId}>
                    <TableCell>{orderStepMap?.[order.orderId]}</TableCell>
                    <TableCell>{getOrderDirection(order.direction)}</TableCell>
                    <TableCell>{fromNumberToMoneyString(order.executedOrderPrice, 'RUB')}</TableCell>
                    <TableCell>{fromNumberToMoneyString(order.commission, 'RUB')}</TableCell>
                    <TableCell sx={getColorSx(order.profit)}>{ order.profit !== undefined && fromNumberToMoneyString(order.profit, 'RUB')}</TableCell>
                    <TableCell>{order.executionDate ? format(order.executionDate, 'dd.MM.yyyy HH:mm') : ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
  )
}
