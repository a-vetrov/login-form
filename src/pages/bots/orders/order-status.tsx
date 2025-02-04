import React, { useMemo } from 'react'
import type { OrderDataType } from '../../../services/bots'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { Tooltip } from '@mui/material'
import { getOrderDirection, getOrderStatus } from './utils'

interface Props {
  order: OrderDataType
}

export const OrderStatus: React.FC<Props> = ({ order }) => {
  const IconClass = order.direction === 1 ? FileDownloadIcon : FileUploadIcon

  let color = 'action'

  switch (order.status) {
    case 1: color = 'success'; break
    case 4: color = 'warning'; break
    default: color = 'error'; break
  }

  const title = useMemo(() => {
    return `${getOrderDirection(order.direction)} ${getOrderStatus(order.status)}`
  }, [order.direction, order.status])

  return (
    <Tooltip title={title}>
      <IconClass color={color} />
    </Tooltip>
  )
}
