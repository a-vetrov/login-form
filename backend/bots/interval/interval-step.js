export const STATE = {
  WAIT_ENTRY_PRICE: 'WAIT_ENTRY_PRICE', // Ожидание цены, чтобы выставить заявку
  TRY_TO_BUY: 'TRY_TO_BUY', // Создана заявка на покупку
  TRY_TO_SELL: 'TRY_TO_SELL' // Создана заявка на продажу
}

export class IntervalStep {
  constructor (bounds) {
    this.bounds = bounds
    this.state = STATE.WAIT_ENTRY_PRICE
    this.orderId = undefined
  }

  update = (state, orderId) => {
    this.state = state
    this.orderId = orderId
  }

  static generate (bounds, stepsCount) {
    const stepSize = (bounds.max - bounds.min) / (stepsCount - 1)

    if (!stepSize) {
      return null
    }

    const stepsData = []
    for (let i = 0; i < stepsCount; i++) {
      const min = bounds.min + stepSize * i
      const max = min + stepSize / 2
      stepsData.push(new IntervalStep({ min, max }))
    }
    return stepsData
  }
}
