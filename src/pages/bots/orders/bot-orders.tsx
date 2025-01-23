import React, { useMemo } from 'react'
import { type OrderDataType, useGetBotOrdersQuery } from '../../../services/bots'
import { Accordion, AccordionDetails, AccordionSummary, TableHead, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableContainer from '@mui/material/TableContainer'
import { getOrderDirection, getOrderStatus } from './utils'
import { fromNumberToMoneyString } from '../../../utils/money'
import { format } from 'date-fns'
import { OrderRow } from './order-row'

interface Props {
  id: string
  active?: boolean
}

export const BotOrders: React.FC<Props> = ({ id, active }) => {
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
      <Accordion>
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
                  <TableCell>Тип</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Дата создания</TableCell>
                  <TableCell>Дата исполнения</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.orders.map((order) => (
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
        </AccordionDetails>
      </Accordion>

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
                  <TableCell>Мин</TableCell>
                  <TableCell>Макс</TableCell>
                  <TableCell>Прибыль</TableCell>
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
