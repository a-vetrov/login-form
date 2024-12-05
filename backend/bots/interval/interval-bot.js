import { TinkoffInvestApi, Helpers } from 'tinkoff-invest-api'
import { v6 as uuidv6 } from 'uuid'
import { IntervalStep, STATE } from './interval-step.js'

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

    this.steps = IntervalStep.generate(this.bounds, this.stepsCount)

    console.log('this.steps', this.steps)

    this.start()
  }

  start () {
    console.log('Interval bot started!')
    this.api.stream.market.on('error', this.handleStreamError)
    this.api.stream.market.on('close', this.handleStreamClose)
    // this.api.stream.trades.on('data', this.subscribeTradesHandler)

    void this.createLastPriceStream()
    // void this.createTradesStream()
  }

  handleStreamError = (error) => {
    console.log('stream error', error)
  }

  handleStreamClose = (error) => {
    console.log('stream closed, reason:', error)
  }

  subscribeLastPriceHandler = async (result) => {
    console.log('subscribeLastPriceHandler', result)

    const price = Helpers.toNumber(result.price)

    if (!price) {
      return
    }

    const promises = []

    this.steps.filter((item) => item.state === STATE.WAIT_ENTRY_PRICE && item.bounds.min <= price).forEach((step) => {
      promises.push(this.buyOrder(step))
    })

    await Promise.all(promises)
    //console.log('this.steps', this.steps)
  }

  async createLastPriceStream () {
    const unsubscribeLastPrice = await this.api.stream.market.lastPrice({
      instruments: [
        {
          figi: this.product.figi,
          instrumentId: this.product.uid
        }
      ]
    }, this.subscribeLastPriceHandler)
  }

  subscribeTradesHandler = async (result) => {
    console.log('subscribeTradesHandler', result)
  }

  async createTradesStream () {
    console.log('this.account', this.account)
    await this.api.stream.trades.watch({
      accounts: [this.account]
    })
  }

  async buyOrder (step) {
    const orderId = uuidv6()
    const price = step.bounds.min
    step.update(STATE.TRY_TO_BUY, orderId)
    const body = {
      quantity: this.amountPerStep,
      price: Helpers.toQuotation(price),
      orderId,
      direction: 1, // Покупка
      accountId: this.account,
      orderType: 1,
      instrumentId: this.product.uid,
      figi: '',
      time_in_force: 1,
      price_type: 2
    }
    const data = await this.api.sandbox.postSandboxOrder(body)
    console.log('buyOrder price = ', price, 'orderId = ', data.orderId)
    console.log(data)
    step.update(STATE.TRY_TO_BUY, data.orderId)
    return data
  }
}
