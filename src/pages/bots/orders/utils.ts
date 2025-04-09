import { type OrderDataType } from '../../../services/bots'
import type { SxProps } from '@mui/system'
import type { Theme } from '@mui/material'

export const getOrderDirection = (direction: number): string => {
  switch (direction) {
    case 1: return 'Покупка'
    case 2: return 'Продажа'
    default: return 'Не определено'
  }
}

export const getOrderStatus = (status: number): string => {
  switch (status) {
    case 1: return 'Исполнен'
    case 2: return 'Отклонен'
    case 3: return 'Отменен пользователем'
    case 4: return 'Новый'
    case 5: return 'Частично исполнен'
    default: return 'Не определено'
  }
}

export const getOrderProfit = (order: OrderDataType): number => {
  if (order.status !== 1) {
    return 0
  }
  return order.direction === 1 ? -order.executedOrderPrice : order.executedOrderPrice
}

export const sortByDate = (a: OrderDataType, b: OrderDataType): number => {
  const dateA = new Date(a.executionDate)
  const dateB = new Date(b.executionDate)
  return dateA - dateB
}

export const getColorSx = (value?: number): SxProps<Theme> | null => {
  if (!value) {
    return null
  }
  return {
    color: value > 0 ? 'success.main' : 'error.light'
  }
}
