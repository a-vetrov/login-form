import React, { useEffect, useMemo } from 'react'
import {
  type OrderDataType,
  useGetBotStatisticsQuery,
  useLazyGetBotOrdersQuery
} from '../../../services/bots'
import { TableHead, Typography } from '@mui/material'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { OrderRow } from '../orders/order-row'
import { IntervalStats } from './interval-stats'

interface Props {
  id: string
  active?: boolean
}

export const IntervalDetails: React.FC<Props> = ({ id, active }) => {
  const [getOrders, { data: ordersData }] = useLazyGetBotOrdersQuery()

  const { data: statData, error: statError } = useGetBotStatisticsQuery(id, {
    pollingInterval: active ? 1000 : undefined,
    skipPollingIfUnfocused: true
  })

  useEffect(() => {
    if (statData) {
      void getOrders(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statData?.executedOrdersLength, getOrders, id])

  const ordersMap = useMemo<Record<string, OrderDataType>>(() => {
    if (!ordersData?.orders) {
      return undefined
    }

    return ordersData.orders.reduce<Record<string, OrderDataType>>((accumulator, item) => {
      accumulator[item.orderId] = item
      return accumulator
    }, {})
  }, [ordersData?.orders])

  return (
    <>
      {statData && (
        <>
          <Typography variant="h2" marginBottom={2} marginTop={4}>
            Сводка по боту
          </Typography>
          <IntervalStats data={statData} />
        </>
      )}

      {ordersData?.steps && (
        <>
          <Typography variant="h2" marginBottom={2} marginTop={4}>
            Статус интервалов
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> </TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Мин ⇔ Макс</TableCell>
                  <TableCell>Прибыль</TableCell>
                  <TableCell>Фактическая комиссия</TableCell>
                  <TableCell>Сервисная комиссия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersData.steps.map((item, index) => (
                  <OrderRow info={item} ordersMap={ordersMap} key={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

    </>
  )
}
