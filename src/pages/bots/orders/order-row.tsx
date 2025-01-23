import React, { useCallback, useMemo, useState } from 'react'
import { type IntervalStepInfo, type OrderDataType } from '../../../services/bots'
import { fromNumberToMoneyString } from '../../../utils/money'
import { Box, Typography, TableRow, TableCell, TableHead, IconButton, Collapse, TableBody } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { getOrderDirection, getOrderStatus } from './utils'
import { format } from 'date-fns'
import Table from '@mui/material/Table'

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

  return (
    <>
    <TableRow sx={{ '& td, & th': { border: 0 } }}>
      <TableCell>
        <IconButton size="small" onClick={openHandler}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">{info.state}</TableCell>
      <TableCell>{fromNumberToMoneyString(info.bounds.min, 'RUB')}</TableCell>
      <TableCell>{fromNumberToMoneyString(info.bounds.max, 'RUB')}</TableCell>
      <TableCell>{0}</TableCell>
    </TableRow>
      {orders?.length && (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body1" gutterBottom component="div">
                Список заявок {orders?.length}
              </Typography>

              <Table size="small">
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
                  {orders.map((order) => (
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
            </Box>
            </Collapse>

          </TableCell>
        </TableRow>
      )}

    </>
  )
}
