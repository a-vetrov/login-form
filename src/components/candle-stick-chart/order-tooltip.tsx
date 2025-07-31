import React, { useMemo } from 'react'
import type { OrderDataType } from '../../services/bots.ts'
import { Box } from '@mui/material'

interface Props {
  orders?: OrderDataType[]
  orderId: string | undefined
  x: number
  y: number
}

export const OrderTooltip: React.FC<Props> = ({ orderId, orders, x, y }) => {
  const selectedOrder = useMemo(() => {
    if (!orderId || !orders) {
      return null
    }
    return orders.find((item) => item.orderId === orderId)
  }, [orderId, orders])

  const containerStyle = useMemo(() => {
    return {
      position: 'absolute',
      zIndex: 1,
      top: y,
      left: x,
      transform: 'translate(-50%, 5px)'
    }
  }, [x, y])

  const innerBoxStyle = useMemo(() => {
    const sx = {
      border: '1px solid red',
      marginLeft: '-50%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        {selectedOrder.orderId}
      </Box>
    )
  }, [innerBoxStyle, selectedOrder])

  if (!orderContent) {
    return null
  }

  return (
    <Box sx={containerStyle}>
      {orderContent}
    </Box>
  )
}
