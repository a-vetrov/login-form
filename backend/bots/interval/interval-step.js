import { getBotById } from '../../db/models/bots/bots.js'
import { IntervalStepModel } from '../../db/models/bots/interval-step.js'

export const STATE = {
  WAIT_ENTRY_PRICE: 'WAIT_ENTRY_PRICE', // Ожидание цены, чтобы выставить заявку
  TRY_TO_BUY: 'TRY_TO_BUY', // Создана заявка на покупку
  TRY_TO_SELL: 'TRY_TO_SELL' // Создана заявка на продажу
}

export class IntervalStep {
  constructor (bounds, serialNumber, botId) {
    this.bounds = bounds
    this.state = STATE.WAIT_ENTRY_PRICE
    this.orders = []
    this.orderId = undefined
    this.orderStatus = undefined
    this.serialNumber = serialNumber
    this.botId = botId
  }

  update = async (state, orderId) => {
    this.state = state
    this.orderId = orderId

    const stepDocument = await this.getStepDocument()
    stepDocument.state = state
    if (orderId) {
      this.orders.push(orderId)
      stepDocument.orders.push(orderId)
    }
    await stepDocument.save()
  }

  updateOrderStatus = async (value) => {
    this.orderStatus = value
    const stepDocument = await this.getStepDocument()
    stepDocument.orderStatus = value
    await stepDocument.save()
  }

  static generate (bounds, stepsCount, botId, stepProfit) {
    const stepSize = (bounds.max - bounds.min) / (stepsCount - 1)

    if (!stepSize) {
      return null
    }

    const stepsData = []
    for (let i = 0; i < stepsCount; i++) {
      const min = bounds.min + stepSize * i
      const max = min + stepProfit
      stepsData.push(new IntervalStep({ min, max }, i, botId))
    }
    return stepsData
  }

  getInfo = () => {
    return {
      state: this.state,
      orderId: this.orderId,
      bounds: this.bounds,
      orders: this.orders,
      serialNumber: this.serialNumber
    }
  }

  getBotModel = async () => {
    return await getBotById(this.botId)
  }

  getStepDocument = async () => {
    return IntervalStepModel.findOne({ botId: this.botId, serialNumber: this.serialNumber })
  }
}
