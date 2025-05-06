import React, { useCallback, useMemo } from 'react'
import type { OrderDataType } from '../../../services/bots'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { Tooltip } from '@mui/material'
import { getOrderDirection } from './utils'

interface Props {
  order: OrderDataType
}

export const OrderStatus: React.FC<Props> = ({ order }) => {
  const IconClass = order.direction === 2 ? FileDownloadIcon : FileUploadIcon

  const color = order.direction === 1 ? 'success' : 'error'

  const title = useMemo(() => {
    return getOrderDirection(order.direction)
  }, [order.direction])

  const handleOpen = useCallback(() => {
    console.log(order)
  }, [order])

  return (
    <Tooltip title={title} onOpen={handleOpen}>
      <IconClass color={color} />
    </Tooltip>
  )
}
