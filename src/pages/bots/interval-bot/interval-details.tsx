import React, { useMemo } from 'react'
import { type OrderDataType, useGetBotOrdersQuery } from '../../../services/bots'
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
  const { data, error } = useGetBotOrdersQuery(id, {
    pollingInterval: active ? 1000 : undefined,
    skipPollingIfUnfocused: true
  })

  const ordersMap = useMemo<Record<string, OrderDataType>>(() => {
    if (!data?.orders) {
      return undefined
    }

    return data.orders.reduce<Record<string, OrderDataType>>((accumulator, item) => {
      accumulator[item.orderId] = item
      return accumulator
    }, {})
  }, [data?.orders])

  return (
    <>
      {data?.orders && (
        <>
          <Typography variant="h2" marginBottom={2} marginTop={4}>
            Сводка по боту
          </Typography>
          <IntervalStats orders={data.orders} />
        </>
      )}

      {data?.steps && (
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
                {data.steps.map((item, index) => (
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
