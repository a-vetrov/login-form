import { OrdersModel, updateOrderRecord } from '../../db/models/bots/order.js'
import { forEachSeries } from '../../utils/promise.js'

const WAITING_INTERVAL = 300_000

export class OrderUpdater {
  constructor ({ botId, account }) {
    this.botId = botId
    this.account = account
    this.readyForUpdate = false
    this.waitingForUpdate()
  }

  timerHandler = () => {
    this.readyForUpdate = true
  }

  waitingForUpdate = () => {
    setTimeout(this.timerHandler, WAITING_INTERVAL)
  }

  updateOrderStatus = async (order) => {
    const data = await this.account.getOrderState(order.orderId)
    await updateOrderRecord({
      orderId: order.orderId,
      status: data.executionReportStatus,
      data
    })
  }

  updateOrders = async () => {
    if (!this.readyForUpdate) {
      return
    }
    this.readyForUpdate = false
    try {
      const orders = await OrdersModel.find({ botId: this.botId, status: 1, executedCommission: 0 })
      console.log('!!!!!!!updateOrders', orders.length)
      await forEachSeries(orders, this.updateOrderStatus)
    } catch (e) {
      console.log('updateOrders error', e)
    } finally {
      this.waitingForUpdate()
    }
  }
}
