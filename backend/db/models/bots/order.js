import mongoose from 'mongoose'
import { getBotById } from './bots.js'

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
  botId: { type: Schema.Types.ObjectId, ref: 'BotsModel' },
  status: Number,
  direction: Number,
  date: { type: Date, default: Date.now },
  executionDate: { type: Date, default: null },
  properties: {
    type: Map,
    of: {}
  }
})

export const OrdersModel = mongoose.model('Orders', orderSchema)

export const getOrderByOrderId = async (orderId) => OrdersModel.find({ orderId })

export const createNewOrderRecord = async ({ orderId, botId, quantity, price, direction }) => {
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
    properties: {
      price,
      quantity
    }
  }).save()
}

export const updateOrderRecord = async ({ orderId, status }) => {
  console.log('updateOrderRecord', { orderId, status })
  await OrdersModel.findOneAndUpdate({ orderId }, { status, executionDate: new Date() })
}

export const getBotOrders = async (botId) => {
  return OrdersModel.find({ botId })
}
