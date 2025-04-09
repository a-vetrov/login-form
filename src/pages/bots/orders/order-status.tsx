import React, { useMemo } from 'react'
import type { OrderDataType } from '../../../services/bots'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { Tooltip } from '@mui/material'
import { getOrderDirection } from './utils'

interface Props {
  order: OrderDataType
}

export const OrderStatus: React.FC<Props> = ({ order }) => {
  const IconClass = order.direction === 1 ? FileDownloadIcon : FileUploadIcon

  const color = order.direction === 1 ? 'error' : 'success'

  const title = useMemo(() => {
    return getOrderDirection(order.direction)
  }, [order.direction])

  return (
    <Tooltip title={title}>
      <IconClass color={color} />
    </Tooltip>
  )
}
