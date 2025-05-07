import { type IntervalStepInfo, type OrderDataType } from '../../../services/bots'
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
  return dateB - dateA
}

export const getColorSx = (value?: number): SxProps<Theme> | null => {
  if (!value) {
    return null
  }
  return {
    color: value > 0 ? 'success.main' : 'error.light'
  }
}

export const createStepOrdersDict = (steps?: IntervalStepInfo[]): Map<string, IntervalStepInfo> | undefined => {
  return steps?.reduce((accumulator, step) => {
    step.orders.forEach((order) => accumulator.set(order, step))
    return accumulator
  }, new Map<string, IntervalStepInfo>())
}

export const createOrdersDict = (orders?: OrderDataType[]): Map<string, OrderDataType> | undefined => {
  return orders?.reduce((accumulator, order) => {
    accumulator.set(order.orderId, order)
    return accumulator
  }, new Map<string, OrderDataType>())
}

export const getNextOrder = (order: OrderDataType, ordersDict: Map<string, OrderDataType>, stepOrdersDict: Map<string, IntervalStepInfo>) => {
  const step = stepOrdersDict.get(order.orderId)
  if (!step) {
    return undefined
  }
  let index = step.orders.indexOf(order.orderId)
  if (index < 0) {
    return undefined
  }
  index++

  while (index < step.orders.length) {
    const id = step.orders[index]
    const nextOrder = ordersDict.get(id)
    if (nextOrder && nextOrder.direction !== order.direction) {
      return nextOrder
    }
    index++
  }

  return undefined
}

export const getPreviousOrder = (order: OrderDataType, ordersDict: Map<string, OrderDataType>, stepOrdersDict: Map<string, IntervalStepInfo>) => {
  const step = stepOrdersDict.get(order.orderId)
  if (!step) {
    return undefined
  }
  let index = step.orders.indexOf(order.orderId)
  if (index < 0) {
    return undefined
  }
  index--

  while (index >= 0) {
    const id = step.orders[index]
    const previousOrder = ordersDict.get(id)
    if (previousOrder && previousOrder.direction !== order.direction) {
      return previousOrder
    }
    index--
  }

  return undefined
}
