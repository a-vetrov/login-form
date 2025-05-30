import React, { useCallback, useMemo, useState } from 'react'
import { type OrdersListDataType } from '../../../services/bots'
import { Accordion, AccordionDetails, AccordionSummary, Button, TableHead, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableContainer from '@mui/material/TableContainer'
import { createOrdersDict, createStepOrdersDict, getColorSx, getNextOrder, getPreviousOrder, sortByDate } from './utils'
import { fromNumberToMoneyString } from '../../../utils/money'
import { format } from 'date-fns'
import { OrderStatus } from './order-status'

interface Props {
  data: OrdersListDataType
  lotPrice?: number
}

const accordionMargin = { marginY: 4 }

const COUNT_STEP = 20

export const BotOrders: React.FC<Props> = ({ data, lotPrice }) => {
  const [countToShow, setCountToShow] = useState(COUNT_STEP)
  const stepOrdersDict = useMemo(() => createStepOrdersDict(data.steps), [data])
  const ordersDict = useMemo(() => createOrdersDict(data.orders), [data])

  const openOrders = useMemo(() => {
    const dict = new Set()

    if (ordersDict && stepOrdersDict) {
      data.orders.forEach((item) => {
        if (item.direction === 1 && !getNextOrder(item, ordersDict, stepOrdersDict)) {
          dict.add(item.orderId)
        }
      })
    }

    return dict
  }, [data.orders, ordersDict, stepOrdersDict])

  const orders = useMemo(() => {
    if (!data.orders || !ordersDict || !stepOrdersDict) {
      return undefined
    }

    return data.orders.slice().sort(sortByDate).map((item) => {
      const commission = item.executedCommission || item.initialCommission
      let profit: number | undefined
      let upnl: number | undefined
      try {
        if (item.direction === 2) {
          const prevOrder = getPreviousOrder(item, ordersDict, stepOrdersDict)
          if (prevOrder) {
            const prevCommission = prevOrder.executedCommission || prevOrder.initialCommission
            profit = item.executedOrderPrice - prevOrder.executedOrderPrice - commission - prevCommission
          }
        }
        if (openOrders.has(item.orderId) && lotPrice !== undefined) {
          upnl = lotPrice * item.lotsExecuted - item.executedOrderPrice - commission
        }
      } catch (e) {}

      return {
        ...item,
        profit,
        upnl,
        commission
      }
    })
  }, [data.orders, lotPrice, openOrders, ordersDict, stepOrdersDict])

  const total = useMemo(() => {
    if (!orders) {
      return {}
    }
    let commission = 0
    let profit = 0
    let upnl = 0

    orders?.forEach((item) => {
      if (item.commission) {
        commission += item.commission
      }
      if (item.profit) {
        profit += item.profit
      }
      if (item.upnl) {
        upnl += item.upnl
      }
    })

    return {
      commission,
      profit,
      upnl
    }
  }, [orders])

  const handleClickShowAll = useCallback(() => {
    setCountToShow(data.orders.length)
  }, [data.orders])

  const lastRow = useMemo(() => {
    if (countToShow >= data.orders.length) {
      return null
    }

    const handleClick = (): void => {
      setCountToShow(countToShow + COUNT_STEP)
    }

    return (
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell colSpan={6}>
          <Button onClick={handleClick}>
            Показать еще {COUNT_STEP}...
          </Button>
          <Button onClick={handleClickShowAll}>
            Показать все {data.orders.length}...
          </Button>
        </TableCell>
      </TableRow>
    )
  }, [countToShow, data.orders, handleClickShowAll])

  const handleAccordionChange = useCallback((_event: React.SyntheticEvent, expanded: boolean) => {
    if (!expanded) {
      setCountToShow(COUNT_STEP)
    }
  }, [])

  const slicedOrders = useMemo(() => orders?.slice(0, countToShow), [orders, countToShow])

  return (
      <Accordion sx={accordionMargin} onChange={handleAccordionChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="h3">Список ордеров ({data?.orders.length} шт.)</Typography>
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
                {slicedOrders?.map((order) => (
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
                {lastRow}
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>Итого</TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell>{total.commission && fromNumberToMoneyString(total.commission, 'RUB')}</TableCell>
                  <TableCell sx={getColorSx(total.profit)}>{ total.profit !== undefined && fromNumberToMoneyString(total.profit, 'RUB')}</TableCell>
                  <TableCell sx={getColorSx(total.upnl)}>{ total.upnl !== undefined && fromNumberToMoneyString(total.upnl, 'RUB')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
  )
}
