import { TinkoffInvestApi } from 'tinkoff-invest-api'
import { v6 as uuidv6 } from 'uuid'

export class IntervalBot {
  constructor ({ token, account, product, bounds, stepsCount, amountPerStep, id }) {
    this.token = token
    this.account = account
    this.product = product
    this.bounds = bounds
    this.stepsCount = stepsCount
    this.amountPerStep = amountPerStep
    this.id = id

    this.api = new TinkoffInvestApi({ token: token.token })

    console.log('Interval bot created!')

    this.start()
  }

  start () {
    console.log('Interval bot started!')
  }

  async buyOrder (price) {
    const body = {
      quantity: this.amountPerStep,
      price,
      orderId: uuidv6(),
      direction: 1, // Покупка
      accountId: this.account,
      orderType: 1,
      instrumentId: this.product,
      figi: '',
      time_in_force: 1,
      price_type: 2
    }
    const data = await api.sandbox.postSandboxOrder(body)
    console.log(data)
  }
}
