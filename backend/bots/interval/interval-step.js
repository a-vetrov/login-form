import {getBotById} from "../../db/models/bots/bots.js";

export const STATE = {
  WAIT_ENTRY_PRICE: 'WAIT_ENTRY_PRICE', // Ожидание цены, чтобы выставить заявку
  TRY_TO_BUY: 'TRY_TO_BUY', // Создана заявка на покупку
  TRY_TO_SELL: 'TRY_TO_SELL' // Создана заявка на продажу
}

export class IntervalStep {
  constructor (bounds, serialNumber, botId) {
    this.bounds = bounds
    this.state = STATE.WAIT_ENTRY_PRICE
    this.orderId = undefined
    this.orderStatus = undefined
    this.serialNumber = serialNumber
    this.botId = botId
  }

  update = async (state, orderId) => {
    this.state = state
    this.orderId = orderId

    const model = await this.getBotModel()
    const steps = model.properties.get('steps')
    console.log('steps', steps)
    const step = steps[this.serialNumber]
    step.state = state
    step.orderId = orderId
    model.set('properties.steps', steps)
    await model.save()
  }

  updateOrderStatus = async (value) => {
    this.orderStatus = value
    const model = await this.getBotModel()
    const steps = model.properties.get('steps')
    const step = steps[this.serialNumber]
    step.orderStatus = value
    model.properties.set('steps', steps.concat())
    await model.save()
  }

  static generate (bounds, stepsCount, botId) {
    const stepSize = (bounds.max - bounds.min) / (stepsCount - 1)

    if (!stepSize) {
      return null
    }

    const stepsData = []
    for (let i = 0; i < stepsCount; i++) {
      const min = bounds.min + stepSize * i
      const max = min + stepSize / 2
      stepsData.push(new IntervalStep({ min, max }, i, botId))
    }
    return stepsData
  }

  getInfo = () => {
    return {
      state: this.state,
      orderId: this.orderId,
      bounds: this.bounds
    }
  }

  getBotModel = async () => {
    return await getBotById(this.botId)
  }
}
