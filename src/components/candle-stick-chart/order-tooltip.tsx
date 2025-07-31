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
  const orderContent = useMemo(() => {
    if (!orderId || !orders) {
      return null
    }

    const selectedOrder = orders.find((item) => item.orderId === orderId)

    if (!selectedOrder) {
      return null
    }

    return (
      <div>
        {selectedOrder.orderId}
      </div>
    )
  }, [orderId, orders])

  if (!orderContent) {
    return null
  }

  return (
    <Box sx={{ border: '1px solid red', position: 'absolute', top: y, left: x }}>
      {orderContent}
    </Box>
  )
}
