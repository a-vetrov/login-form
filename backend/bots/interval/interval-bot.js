import { Helpers } from 'tinkoff-invest-api'
import { v6 as uuidv6 } from 'uuid'
import { IntervalStep, STATE } from './interval-step.js'
import { forEachSeries } from '../../utils/promise.js'
import { createNewOrderRecord, OrderStatus, updateOrderRecord } from '../../db/models/bots/order.js'
import { updateBotProperties } from '../../db/models/bots/bots.js'
import { TinkoffSandboxAccount } from '../../broker/tinkoff-sandbox.js'
import { TinkoffRealAccount } from '../../broker/tinkoff-real.js'
import { OrderUpdater } from '../utils/order-updater.js'

export class IntervalBot {
  constructor ({ token, account, accountType, product, bounds, stepsCount, stepProfit, amountPerStep, id }) {
    this.token = token
    this.account = accountType === 'sandbox' ? new TinkoffSandboxAccount({ token, account }) : new TinkoffRealAccount({ token, account })
    this.accountType = accountType

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

    this.api = this.account.api

    this.steps = IntervalStep.generate(
      {
        bounds: this.bounds,
        stepsCount: this.stepsCount,
        botId: this.id,
        stepProfit: this.stepProfit,
        minPriceIncrement: this.product.minPriceIncrement
      })

    this.orderUpdater = new OrderUpdater({ botId: this.id, account: this.account })
  }

  start = async () => {
    this.stopStatusChecking = this.startStatusChecking()
    this.active = true
    this.api.stream.market.on('error', this.handleStreamError)
    this.api.stream.market.on('close', this.handleStreamClose)
    // await this.cancelActiveOrders()

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

  updateStepsFromDB = async () => {
    for (const x of this.steps) {
      await x.updateFromBD()
    }
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
    console.log('subscribeLastPriceHandler', this.product.name, price)
    await updateBotProperties(this.id, { lastPrice: price })

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

  cancelOrder = async (orderId) => {
    try {
      const data = await this.account.cancelOrder(orderId)
      await updateOrderRecord({
        orderId,
        status: OrderStatus.EXECUTION_REPORT_STATUS_CANCELLED
      })
      console.log('Order canceled', data)
    } catch (error) {
      console.log('cancelOrder error', error)
    }
  }

  cancelActiveOrders = async () => {
    try {
      const orders = await this.account.getActiveOrders()
      const ids = orders.filter(({ figi }) => figi === this.product.figi).map(({ orderId }) => orderId)
      await forEachSeries(ids, this.cancelOrder)
    } catch (error) {
      console.log('cancelActiveOrders error', error)
    }
  }

  checkSteps = async () => {
    if (this.isFreeze) {
      return
    }
    try {
      const activeOrders = await this.account.getActiveOrders()
      const activeOrdersIds = activeOrders.map((order) => order.orderId)

      const stepsToCheck = this.steps.filter((step) => step.orderId && !activeOrdersIds.includes(step.orderId))
      if (stepsToCheck.length) {
        await this.orderUpdater.updateOrders()
      }
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
    const data = await this.account.getOrderState(step.orderId)

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
      console.log(`${data.orderType === 1 ? 'Покупка' : 'Продажа'} ${this.product.name} по цене ${Helpers.toNumber(data.executedOrderPrice)}`)

      switch (step.state) {
        case STATE.TRY_TO_BUY : {
          console.log(`Купили ${this.product.name}, ставим заявку на продажу.'`)
          await this.sellOrder(step)
          break
        }

        case STATE.TRY_TO_SELL: {
          console.log(`'Продали ${this.product.name}, теперь ждем цену, чтобы купить.`)
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
      orderType: 1,
      instrumentId: this.product.uid,
      figi: '',
      time_in_force: 1,
      price_type: 2
    }
    try {
      const data = await this.account.postOrder(body)
      console.log('buyOrder price = ', price, 'orderId = ', data.orderId)
      const previousOrderId = step.getLastOrder()
      await step.update(STATE.TRY_TO_BUY, data.orderId)
      await createNewOrderRecord({
        orderId: data.orderId,
        previousOrderId,
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
      orderType: 1,
      instrumentId: this.product.uid,
      figi: '',
      time_in_force: 1,
      price_type: 2
    }

    try {
      const data = await this.account.postOrder(body)
      console.log('sellOrder price = ', price, 'orderId = ', data.orderId)
      const previousOrderId = step.getLastOrder()
      await step.update(STATE.TRY_TO_SELL, data.orderId)
      await createNewOrderRecord({
        orderId: data.orderId,
        previousOrderId,
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
