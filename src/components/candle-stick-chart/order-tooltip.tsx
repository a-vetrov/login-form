import React, { useMemo } from 'react'
import type { OrderDataType } from '../../services/bots.ts'
import { Box, Typography } from '@mui/material'
import { format } from 'date-fns'
import { fromNumberToMoneyString } from '../../utils/money.ts'

interface Props {
  orders?: OrderDataType[]
  orderId: string | undefined
  x: number
  y: number
  containerWidth: number
}

export const OrderTooltip: React.FC<Props> = ({ orderId, orders, x, y, containerWidth }) => {
  const selectedOrder = useMemo(() => {
    if (!orderId || !orders) {
      return null
    }
    return orders.find((item) => item.orderId === orderId)
  }, [orderId, orders])

  const commission = selectedOrder?.executedCommission || selectedOrder?.initialCommission || 0

  const profit = useMemo(() => {
    if (!selectedOrder?.previousOrderId || selectedOrder.direction === 1) {
      return null
    }
    const prevOrder = orders.find((item) => item.orderId === selectedOrder.previousOrderId)
    if (!prevOrder) {
      return null
    }
    const prevCommission = prevOrder.executedCommission || prevOrder.initialCommission
    return selectedOrder.executedOrderPrice - prevOrder.executedOrderPrice - commission - prevCommission
  }, [commission, orders, selectedOrder])

  const containerStyle = useMemo(() => {
    const sx = {
      position: 'absolute',
      zIndex: 100,
      top: y + 35,
      left: x
    }

    if (x + 80 > containerWidth) {
      sx.left = x - 80
    }

    if (x < 80) {
      sx.left = x + 80
    }

    return sx
  }, [containerWidth, x, y])

  const innerBoxStyle = useMemo(() => {
    const sx = {
      border: '1px solid red',
      borderRadius: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      px: 2,
      py: 1,
      width: 170,
      marginLeft: '-85px'
    }

    if (selectedOrder?.direction === 1) {
      sx.border = '1px solid green'
    }

    return sx
  }, [selectedOrder])

  const orderContent = useMemo(() => {
    if (!selectedOrder) {
      return null
    }

    return (
      <Box sx={innerBoxStyle}>
        <Typography variant="body1">
          {selectedOrder.direction === 1 ? 'Покупка ' : 'Продажа '}
        </Typography>
        <Typography variant="body2">
          Цена: {fromNumberToMoneyString(selectedOrder.executedOrderPrice / selectedOrder.lotsExecuted / selectedOrder.product.lot, 'RUB')}
        </Typography>
        <Typography variant="body2">
          Сумма: {fromNumberToMoneyString(selectedOrder.executedOrderPrice, 'RUB')}
        </Typography>
        {commission && (
          <Typography variant="body2">
            Комиссия: {fromNumberToMoneyString(commission, 'RUB')}
          </Typography>
        )}
        {profit !== null && (
          <Typography variant="body2">
            Профит: {fromNumberToMoneyString(profit, 'RUB')}
          </Typography>
        )}
        {selectedOrder.executionDate && (
          <Typography variant="body2">{format(selectedOrder.executionDate, 'dd.MM.yyyy HH:mm:ss')}</Typography>
        )}
      </Box>
    )
  }, [commission, innerBoxStyle, profit, selectedOrder])

  if (!orderContent) {
    return null
  }

  return (
    <Box sx={containerStyle}>
      {orderContent}
    </Box>
  )
}
