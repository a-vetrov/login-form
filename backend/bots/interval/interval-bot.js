import { TinkoffInvestApi, Helpers } from 'tinkoff-invest-api'
import { v6 as uuidv6 } from 'uuid'
import { IntervalStep, STATE } from './interval-step.js'
import { forEachSeries } from '../../utils/promise.js'
import { createNewOrderRecord, OrderStatus, updateOrderRecord } from '../../db/models/bots/order.js'

export class IntervalBot {
  constructor ({ token, account, product, bounds, stepsCount, stepProfit, amountPerStep, id }) {
    this.token = token
    this.account = account
    this.product = product
    this.bounds = bounds
    this.stepsCount = stepsCount
    this.stepProfit = stepProfit
    this.amountPerStep = amountPerStep
    this.id = id
    this.unsubscribeLastPrice = undefined
    this.active = false
    this.tradingStatus = true
    this.isFreeze = false

    this.streamLock = false

    this.api = new TinkoffInvestApi({ token: token.token })

    this.steps = IntervalStep.generate(this.bounds, this.stepsCount, this.id, this.stepProfit)
  }

  start = async () => {
    this.stopStatusChecking = this.startStatusChecking()
    this.active = true
    this.api.stream.market.on('error', this.handleStreamError)
    this.api.stream.market.on('close', this.handleStreamClose)
    await this.cancelActiveOrders()

    void this.createLastPriceStream()
  }

  stop = async () => {
    this.active = false
    if (this.unsubscribeLastPrice) {
      await this.unsubscribeLastPrice()
    }
    if (this.stopStatusChecking) {
      this.stopStatusChecking()
    }
    this.api.stream.market.off('error', this.handleStreamError)
    this.api.stream.market.off('close', this.handleStreamClose)
    await this.cancelActiveOrders()
  }

  handleStreamError = (error) => {
    console.log('stream error', error)
  }

  handleStreamClose = (error) => {
    console.log('stream closed, reason:', error)
  }

  subscribeLastPriceHandler = async (result) => {
    if (this.streamLock || this.isFreeze) {
      return
    }

    if (!this.tradingStatus) {
      return
    }

    this.streamLock = true

    const price = Helpers.toNumber(result.price)

    if (!price) {
      return
    }
    console.log('subscribeLastPriceHandler', price)

    const stepsToBuy = this.steps.filter((item) => item.state === STATE.WAIT_ENTRY_PRICE && item.bounds.min <= price)

    // Запускаем запросы последовательно.
    await forEachSeries(stepsToBuy, this.buyOrder)

    await this.checkSteps()
    this.streamLock = false
  }

  createLastPriceStream = async () => {
    this.unsubscribeLastPrice = await this.api.stream.market.lastPrice({
      instruments: [
        {
          figi: this.product.figi,
          instrumentId: this.product.uid
        }
      ]
    }, this.subscribeLastPriceHandler)
  }

  getActiveOrders = async () => {
    const data = await this.api.sandbox.getSandboxOrders({ accountId: this.account })
    // console.log('Active orders:')
    // console.log(data.orders)
    return data.orders
  }

  cancelOrder = async (orderId) => {
    const data = await this.api.sandbox.cancelSandboxOrder({
      accountId: this.account,
      orderId
    })
    await updateOrderRecord({
      orderId,
      status: OrderStatus.EXECUTION_REPORT_STATUS_CANCELLED
    })
    console.log('Order canceled', data)
  }

  cancelActiveOrders = async () => {
    const orders = await this.getActiveOrders()
    const ids = orders.map(({ orderId }) => orderId)
    await forEachSeries(ids, this.cancelOrder)
  }

  checkSteps = async () => {
    if (this.isFreeze) {
      return
    }
    try {
      const activeOrders = await this.getActiveOrders()
      const activeOrdersIds = activeOrders.map((order) => order.orderId)

      const stepsToCheck = this.steps.filter((step) => step.orderId && !activeOrdersIds.includes(step.orderId))
      await forEachSeries(stepsToCheck, this.updateStepState)
    } catch (error) {
      console.log('IntervalBot.checkSteps error', error)
      if (error.type === 'RESOURCE_EXHAUSTED') {
        console.log('FREEZE!!!!')
        this.freezeForMinute()
      }
    }
  }

  updateStepState = async (step) => {
    if (this.isFreeze) {
      return
    }
    const data = await this.api.sandbox.getSandboxOrderState({ accountId: this.account, orderId: step.orderId })

    await step.updateOrderStatus(data.executionReportStatus)

    if (step.orderId) {
      await updateOrderRecord({
        orderId: step.orderId,
        status: data.executionReportStatus,
        data
      })
    }

    // Заявка исполнена
    if (data.executionReportStatus === 1) {
      console.log(`${data.orderType === 1 ? 'Покупка' : 'Продажа'} по цене ${Helpers.toNumber(data.executedOrderPrice)}`)

      switch (step.state) {
        case STATE.TRY_TO_BUY : {
          console.log('Купили, ставим заявку на продажу.')
          await this.sellOrder(step)
          break
        }

        case STATE.TRY_TO_SELL: {
          console.log('Продали, теперь ждем цену, чтобы купить.')
          await step.update(STATE.WAIT_ENTRY_PRICE, undefined)
          break
        }
      }

      return
    }

    // Заявка отклонена, отменена и тп

    switch (step.state) {
      // Возвращаем шаг в состояние ожидания цены
      case STATE.TRY_TO_BUY : {
        await step.update(STATE.WAIT_ENTRY_PRICE, undefined)
        break
      }

      // Попробуем пересоздать заявку на продажу
      case STATE.TRY_TO_SELL: {
        await this.sellOrder(step)
        break
      }
    }
  }

  buyOrder = async (step) => {
    const orderId = uuidv6()
    const price = step.bounds.min
    await step.update(STATE.TRY_TO_BUY, undefined)
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
    try {
      const data = await this.api.sandbox.postSandboxOrder(body)
      console.log('buyOrder price = ', price, 'orderId = ', data.orderId)
      // console.log(data)
      await step.update(STATE.TRY_TO_BUY, data.orderId)
      await createNewOrderRecord({
        orderId: data.orderId,
        botId: this.id,
        quantity: this.amountPerStep,
        price,
        direction: data.direction,
        product: { ...this.product }
      })
      return data
    } catch (e) {
      console.log('buyOrder error', e)
      return null
    }
  }

  sellOrder = async (step) => {
    const orderId = uuidv6()
    const price = step.bounds.max
    await step.update(STATE.TRY_TO_SELL, undefined)
    const body = {
      quantity: this.amountPerStep,
      price: Helpers.toQuotation(price),
      orderId,
      direction: 2, // Продажа
      accountId: this.account,
      orderType: 1,
      instrumentId: this.product.uid,
      figi: '',
      time_in_force: 1,
      price_type: 2
    }

    try {
      const data = await this.api.sandbox.postSandboxOrder(body)
      console.log('sellOrder price = ', price, 'orderId = ', data.orderId)
      // console.log(data)
      await step.update(STATE.TRY_TO_SELL, data.orderId)
      await createNewOrderRecord({
        orderId: data.orderId,
        botId: this.id,
        quantity: this.amountPerStep,
        price,
        direction: data.direction,
        product: { ...this.product }
      })
      return data
    } catch (e) {
      console.log('sellOrder error', e)
      return null
    }
  }

  getInfo = () => {
    const steps = this.steps.map((item) => item.getInfo())
    return { steps }
  }

  getTradingStatus = async () => {
    const request = {
      figi: this.product.figi,
      instrumentId: this.product.uid
    }
    let result = false
    try {
      const data = await this.api.marketdata.getTradingStatus(request)
      result = data.tradingStatus === 5 && data.apiTradeAvailableFlag && data.limitOrderAvailableFlag
    } catch (e) {
      console.log('getTradingStatus error', e)
      result = false
    }

    return result
  }

  updateTradingStatus = async () => {
    if (!this.active || this.isFreeze) {
      return
    }

    this.tradingStatus = await this.getTradingStatus()
    console.log('updateTradingStatus', this.tradingStatus)
  }

  startStatusChecking = () => {
    this.updateTradingStatus()
    const interval = setInterval(this.updateTradingStatus, 120_000)

    const stopStatusChecking = () => {
      clearInterval(interval)
    }
    return stopStatusChecking
  }

  freezeForMinute = () => {
    this.isFreeze = true

    const unfreeze = () => {
      this.isFreeze = false
    }
    setTimeout(unfreeze, 60_000)
  }
}
