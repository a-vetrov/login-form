import { getBotById } from '../../db/models/bots/bots.js'
import { IntervalStepModel } from '../../db/models/bots/interval-step.js'
import round from 'lodash.round'
import {roundToMinPriceIncrement} from "../../utils/money.js";

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

  updateFromBD = async () => {
    const stepDocument = await this.getStepDocument()
    this.state = stepDocument.state
    this.orders = stepDocument.orders.concat()
    if (this.state !== STATE.WAIT_ENTRY_PRICE) {
      this.orderId = this.orders[this.orders.length - 1]
    }
  }

  updateOrderStatus = async (value) => {
    this.orderStatus = value
    const stepDocument = await this.getStepDocument()
    stepDocument.orderStatus = value
    await stepDocument.save()
  }

  static generate ({ bounds, stepsCount, botId, stepProfit, minPriceIncrement }) {
    const stepSize = (bounds.max - bounds.min) / (stepsCount - 1)

    if (!stepSize) {
      return null
    }

    const stepsData = []
    for (let i = 0; i < stepsCount; i++) {
      const min = roundToMinPriceIncrement(bounds.min + stepSize * i, minPriceIncrement)
      const max = roundToMinPriceIncrement(min + (stepProfit * stepSize), minPriceIncrement)
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

  getLastOrder = () => {
    if (!this.orders.length) {
      return undefined
    }
    return this.orders[this.orders.length - 1]
  }
}
