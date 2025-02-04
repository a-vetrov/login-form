import React, { useCallback, useMemo, useState } from 'react'
import { type IntervalStepInfo, type OrderDataType } from '../../../services/bots'
import { fromNumberToMoneyString } from '../../../utils/money'
import { Box, Typography, TableRow, TableCell, TableHead, IconButton, Collapse, TableBody } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { getOrderProfit } from './utils'
import { format } from 'date-fns'
import Table from '@mui/material/Table'
import { OrderStatus } from './order-status'

interface Props {
  info: IntervalStepInfo
  ordersMap?: Record<string, OrderDataType>
}

export const OrderRow: React.FC<Props> = ({ info, ordersMap }) => {
  const [open, setOpen] = useState(false)

  const openHandler = useCallback(() => {
    setOpen(!open)
  }, [open])

  const orders = useMemo(() => {
    if (!ordersMap) {
      return undefined
    }

    return info.orders.map((orderId) => ordersMap[orderId])
  }, [info.orders, ordersMap])

  const stat = useMemo(() => {
    const defaultResult = { profit: 0, executedCommission: 0, serviceCommission: 0 }
    if (!orders) {
      return defaultResult
    }

    const closedOrders = orders.filter((item) => item.status === 1)

    if (closedOrders.length % 2) {
      closedOrders.pop()
    }

    return closedOrders.reduce((accumulator, item) => {
      accumulator.profit += getOrderProfit(item)
      accumulator.executedCommission += item.executedCommission
      accumulator.serviceCommission += item.serviceCommission
      return accumulator
    }, defaultResult)
  }, [orders])

  return (
    <>
    <TableRow sx={{ '& td, & th': { border: 0 } }}>
      <TableCell>{
        orders?.length
          ? (
          <IconButton size="small" onClick={openHandler}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
            )
          : null
      }
      </TableCell>
      <TableCell component="th" scope="row">{info.state}</TableCell>
      <TableCell>{`${fromNumberToMoneyString(info.bounds.min, 'RUB')} ⇔ ${fromNumberToMoneyString(info.bounds.max, 'RUB')}`}</TableCell>
      <TableCell>{fromNumberToMoneyString(stat.profit)}</TableCell>
      <TableCell>{fromNumberToMoneyString(stat.executedCommission)}</TableCell>
      <TableCell>{fromNumberToMoneyString(stat.serviceCommission)}</TableCell>
    </TableRow>
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      {orders?.length
        ? (

            <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body1" gutterBottom component="div">
                Список заявок ({orders?.length} шт.)
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Статус</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell>Дата создания</TableCell>
                    <TableCell>Дата исполнения</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={order.orderId}>
                      <TableCell><OrderStatus order={order}/></TableCell>
                      <TableCell>{fromNumberToMoneyString(order.executedOrderPrice || order.properties.price, 'RUB')}</TableCell>
                      <TableCell>{format(order.date, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell>{order.executionDate ? format(order.executionDate, 'dd.MM.yyyy HH:mm') : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            </Collapse>
          )
        : null}
        </TableCell>
      </TableRow>
    </>
  )
}
