import { sendSocketMessage } from '../websocket.js'
import { SocketMessageType } from '../enums/SocketMessageType.js'

export const BotLoggerMessageType = {
  PRICE_UPDATE: 'PRICE_UPDATE',
  ORDER_CANCELED: 'ORDER_CANCELED',
  ORDER_CANCELED_ERROR: 'ORDER_CANCELED_ERROR',
  CANCEL_ACTIVE_ORDERS_ERROR: 'CANCEL_ACTIVE_ORDERS_ERROR',
  CHECK_STEPS_ERROR: 'CHECK_STEPS_ERROR',
  ORDER_EXECUTE: 'ORDER_EXECUTE',
  BUY_ORDER: 'BUY_ORDER',
  BUY_ORDER_ERROR: 'BUY_ORDER_ERROR',
  SELL_ORDER: 'SELL_ORDER',
  SELL_ORDER_ERROR: 'SELL_ORDER_ERROR',
  FREEZE: 'FREEZE',
  ERROR: 'ERROR'
}

export const logBotMessage = (userId, botId, type, message) => {
  console.log(`User: ${userId} Bot: ${botId} ${type}: ${JSON.stringify(message)}`)

  sendSocketMessage(userId, SocketMessageType.BOT_INFO, { type, botId, message })
}
