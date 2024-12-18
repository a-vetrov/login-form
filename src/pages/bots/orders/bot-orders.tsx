import React from 'react'
import { useGetBotOrdersQuery } from '../../../services/bots'
import { TableHead, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { getOrderDirection, getOrderStatus } from './utils'
import { fromNumberToMoneyString } from '../../../utils/money'
import { format } from 'date-fns'

interface Props {
  id: string
  active?: boolean
}

export const BotOrders: React.FC<Props> = ({ id, active }) => {
  const { data, error } = useGetBotOrdersQuery(id, {
    pollingInterval: active ? 1000 : undefined,
    skipPollingIfUnfocused: true
  })
  return (
    <>
      <Typography variant="h2" marginY={2}>
        Список ордеров
      </Typography>
      {data?.orders && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Тип</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell>Дата исполнения</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.orders.map((order) => (
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={order.orderId}>
                  <TableCell component="th" scope="row">{getOrderDirection(order.direction)}</TableCell>
                  <TableCell>{getOrderStatus(order.status)}</TableCell>
                  <TableCell>{fromNumberToMoneyString(order.properties.price, 'RUB')}</TableCell>
                  <TableCell>{format(order.date, 'dd.MM.yyyy HH:mm')}</TableCell>
                  <TableCell>{order.executionDate ? format(order.executionDate, 'dd.MM.yyyy HH:mm') : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                  <TableCell>Статус</TableCell>
                  <TableCell>Мин</TableCell>
                  <TableCell>Макс</TableCell>
                  <TableCell>Ордер</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.steps.map((item, index) => (
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={index}>
                    <TableCell component="th" scope="row">{item.state}</TableCell>
                    <TableCell>{fromNumberToMoneyString(item.bounds.min, 'RUB')}</TableCell>
                    <TableCell>{fromNumberToMoneyString(item.bounds.max, 'RUB')}</TableCell>
                    <TableCell>{item.orderId || ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}
