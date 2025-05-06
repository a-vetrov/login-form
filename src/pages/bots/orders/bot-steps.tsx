import React, { useMemo } from 'react'
import type { OrderDataType, OrdersListDataType } from '../../../services/bots'
import { Accordion, AccordionDetails, AccordionSummary, TableHead, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { format } from 'date-fns'
import { OrderStatus } from './order-status'
import { fromNumberToMoneyString } from '../../../utils/money'
import {getColorSx, getOrderStatus} from './utils'

const accordionMargin = { marginY: 4 }

interface Props {
  data: OrdersListDataType
  lotPrice?: number
}

const BotSteps: React.FC<Props> = ({ data, lotPrice }) => {
  const ordersMap = useMemo(() => {
    if (!data?.ordersAll) {
      return undefined
    }

    return data.ordersAll.reduce<Record<string, OrderDataType>>((accumulator, item) => {
      accumulator[item.orderId] = item
      return accumulator
    }, {})
  }, [data?.ordersAll])

  if (!ordersMap || !data.steps) {
    return null
  }

  return (
    <Accordion sx={accordionMargin}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography variant="h3">Список интервалов ({data?.steps.length} шт.)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {data.steps.map((step) => {
          return (
            <Paper key={step.serialNumber} sx={{ marginY: 2 }}>
              <Typography variant="h4">{step.serialNumber} {step.state}</Typography>
              <Typography variant="body1">{step.bounds.min} ↹ {step.bounds.max}</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Направление</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell>Дата создания</TableCell>
                    <TableCell>Дата исполнения</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
              {step.orders.map((id) => {
                const order = ordersMap[id]
                if (!order) {
                  return null
                }
                return (
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={order.orderId}>
                      <TableCell><OrderStatus order={order}/></TableCell>
                      <TableCell>{getOrderStatus(order.status)}</TableCell>
                      <TableCell>{fromNumberToMoneyString(order.executedOrderPrice || order.properties.price, 'RUB')}</TableCell>
                      <TableCell>{format(order.date, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell>{order.executionDate ? format(order.executionDate, 'dd.MM.yyyy HH:mm') : ''}</TableCell>
                    </TableRow>
                )
              })}
                </TableBody>
              </Table>
            </Paper>
          )
        })}
      </AccordionDetails>
    </Accordion>
  )
}

export default BotSteps
