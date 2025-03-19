import mongoose from 'mongoose'
import { getBotById } from './bots.js'
import { productSchema } from '../catalog/product.js'
import { Helpers } from 'tinkoff-invest-api'

const { Schema } = mongoose

export const OrderStatus = {
  EXECUTION_REPORT_STATUS_UNSPECIFIED: 0, // none
  EXECUTION_REPORT_STATUS_FILL: 1, // Исполнена
  EXECUTION_REPORT_STATUS_REJECTED: 2, // Отклонена
  EXECUTION_REPORT_STATUS_CANCELLED: 3, // Отменена пользователем
  EXECUTION_REPORT_STATUS_NEW: 4, // Новая
  EXECUTION_REPORT_STATUS_PARTIALLYFILL: 5 // Частично исполнена
}

export const OrderDirection = {
  ORDER_DIRECTION_UNSPECIFIED: 0, // Значение не указано
  ORDER_DIRECTION_BUY: 1, // Покупка
  ORDER_DIRECTION_SELL: 2 // Продажа
}

const orderSchema = new Schema({
  orderId: String,
  product: productSchema,
  botId: { type: Schema.Types.ObjectId, ref: 'BotsModel' },
  status: Number,
  direction: Number,
  date: { type: Date, default: Date.now },
  executionDate: { type: Date, default: null },
  orderDate: { type: Date, default: null },
  lotsRequested: Number,
  lotsExecuted: Number,
  initialOrderPrice: Number,
  executedOrderPrice: Number,
  totalOrderAmount: Number,
  averagePositionPrice: Number,
  initialCommission: Number,
  executedCommission: Number,
  initialSecurityPrice: Number,
  serviceCommission: Number,
  properties: {
    type: Map,
    of: {}
  }
})

export const OrdersModel = mongoose.model('Orders', orderSchema)

export const getOrderByOrderId = async (orderId) => OrdersModel.find({ orderId })

export const createNewOrderRecord = async ({ orderId, botId, quantity, price, direction, product }) => {
  const bot = await getBotById(botId)

  if (!bot) {
    return
  }

  console.log('createNewOrderRecord', { orderId, botId, quantity, price, direction })

  await new OrdersModel({
    orderId,
    botId: bot._id,
    status: OrderStatus.EXECUTION_REPORT_STATUS_NEW,
    direction,
    product,
    properties: {
      price,
      quantity
    }
  }).save()
}

const getOrderProperties = (data) => {
  if (!data) {
    return null
  }
  const {
    lotsRequested, lotsExecuted, orderDate, initialOrderPrice, executedOrderPrice, totalOrderAmount,
    averagePositionPrice, initialCommission, executedCommission, initialSecurityPrice, serviceCommission
  } = data

  return {
    lotsRequested,
    lotsExecuted,
    orderDate,
    initialOrderPrice: Helpers.toNumber(initialOrderPrice),
    executedOrderPrice: Helpers.toNumber(executedOrderPrice),
    totalOrderAmount: Helpers.toNumber(totalOrderAmount),
    averagePositionPrice: Helpers.toNumber(averagePositionPrice),
    initialCommission: Helpers.toNumber(initialCommission),
    executedCommission: Helpers.toNumber(executedCommission),
    initialSecurityPrice: Helpers.toNumber(initialSecurityPrice),
    serviceCommission: Helpers.toNumber(serviceCommission)
  }
}

export const updateOrderRecord = async ({ orderId, status, data }) => {
  /*
  const dataFormat = {
    orderId: '369f7640-300f-457d-be35-6e09e008e75e',
    executionReportStatus: 1,
    lotsRequested: 1,
    lotsExecuted: 1,
    initialOrderPrice: { currency: 'rub', units: 2793, nano: 900000000 },
    executedOrderPrice: { currency: 'rub', units: 2793, nano: 900000000 },
    totalOrderAmount: { currency: 'rub', units: 2793, nano: 900000000 },
    averagePositionPrice: { currency: 'rub', units: 279, nano: 390000000 },
    initialCommission: { currency: 'rub', units: 1, nano: 396950000 },
    executedCommission: { currency: 'rub', units: 1, nano: 396950000 },
    figi: 'BBG004730N88',
    direction: 1,
    initialSecurityPrice: { currency: 'rub', units: 279, nano: 390000000 },
    stages: [],
    serviceCommission: { currency: 'rub', units: 0, nano: 0 },
    currency: 'rub',
    orderType: 1,
    orderDate: 2025-01-23T14:24:37.510Z,
    instrumentUid: 'e6123145-9665-43e0-8413-cd61b8aa9b13',
    orderRequestId: '1efd995b-0a89-6f10-96a2-f8bcd0ae5efc'
}
*/

  console.log('updateOrderRecord', { orderId, status, data })
  await OrdersModel.findOneAndUpdate({ orderId },
    {
      status,
      executionDate: new Date(),
      ...getOrderProperties(data)
    })
}

export const getBotOrders = async (botId) => {
  return OrdersModel.find({ botId })
}

export const getBotStatistics = async (botId) => {
  const orders = await OrdersModel.find({ botId, status: 1 })
  const executedOrdersLength = orders.length
  let lots = 0
  let lotsBuy = 0
  let priceBuy = 0
  let lotsSell = 0
  let priceSell = 0
  let commission = 0
  let serviceCommission = 0

  orders.forEach((order) => {
    const { direction, lotsExecuted, executedCommission, executedOrderPrice } = order

    if (direction === 1) {
      lotsBuy += lotsExecuted
      lots += lotsExecuted
      if (executedOrderPrice) {
        priceBuy += executedOrderPrice
      }
    } else {
      lotsSell += lotsExecuted
      lots -= lotsExecuted
      if (executedOrderPrice) {
        priceSell += executedOrderPrice
      }
    }

    if (executedCommission) {
      commission += executedCommission
    }

    if (order.serviceCommission) {
      serviceCommission += order.serviceCommission
    }
  })

  return {
    executedOrdersLength, lotsBuy, lotsSell, lots, commission, serviceCommission, priceBuy, priceSell
  }
}
