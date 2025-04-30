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
import { getColorSx, sortByDate } from './utils'
import { fromNumberToMoneyString } from '../../../utils/money'
import { format } from 'date-fns'
import { OrderStatus } from './order-status'

interface Props {
  data: OrdersListDataType
  lotPrice?: number
}

const accordionMargin = { marginY: 4 }

export const BotOrders: React.FC<Props> = ({ data, lotPrice }) => {
  const openOrders = useMemo(() => {
    const dict = new Set()

    data.orders.forEach((item) => {
      if (item.direction === 1) {
        dict.add(item.orderId)
      } else {
        if (dict.has(item.previousOrderId)) {
          dict.delete(item.previousOrderId)
        }
      }
    })

    return dict
  }, [data.orders])

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
    if (!data?.steps || !data.orders || !ordersMap) {
      return undefined
    }

    return data.orders.slice().sort(sortByDate).map((item) => {
      const commission = item.executedCommission || item.initialCommission
      let profit: number | undefined
      let upnl: number | undefined
      try {
        if (item.direction === 2) {
          const previousOrderId = item.previousOrderId
          const prevOrder = ordersMap[previousOrderId]
          const prevCommission = prevOrder.executedCommission || prevOrder.initialCommission
          profit = item.executedOrderPrice - prevOrder.executedOrderPrice - commission - prevCommission
        }
        if (openOrders.has(item.orderId) && lotPrice !== undefined) {
          upnl = lotPrice * item.lotsExecuted - item.executedOrderPrice
        }
      } catch (e) {}

      return {
        ...item,
        profit,
        upnl,
        commission
      }
    })
  }, [data.orders, data?.steps, lotPrice, openOrders, ordersMap])

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
                  <TableCell>Дата исполнения</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Комиссия</TableCell>
                  <TableCell>Профит</TableCell>
                  <TableCell>Upnl</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={order.orderId}>
                    <TableCell>{order.executionDate ? format(order.executionDate, 'dd.MM.yyyy HH:mm:ss') : ''}</TableCell>
                    <TableCell>
                      <OrderStatus order={order}/>
                    </TableCell>
                    <TableCell>{fromNumberToMoneyString(order.executedOrderPrice, 'RUB')}</TableCell>
                    <TableCell>{fromNumberToMoneyString(order.commission, 'RUB')}</TableCell>
                    <TableCell sx={getColorSx(order.profit)}>{ order.profit !== undefined ? fromNumberToMoneyString(order.profit, 'RUB') : '-'}</TableCell>
                    <TableCell sx={getColorSx(order.upnl)}>{ order.upnl !== undefined && fromNumberToMoneyString(order.upnl, 'RUB')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
  )
}
