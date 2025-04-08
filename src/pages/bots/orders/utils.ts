import type { OrderDataType } from '../../../services/bots'

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
