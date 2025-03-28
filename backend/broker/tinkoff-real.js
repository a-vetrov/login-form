import { TinkoffInvestApi } from 'tinkoff-invest-api'

export class TinkoffRealAccount {
  constructor ({ token, account }) {
    this.token = token
    this.account = account

    this.api = new TinkoffInvestApi({ token: token.token })
  }

  isSandbox () {
    return false
  }

  getActiveOrders = async () => {
    const data = await this.api.orders.getOrders({ accountId: this.account })
    return data.orders
  }

  cancelOrder = async (orderId) => {
    const data = await this.api.orders.cancelOrder({
      accountId: this.account,
      orderId
    })
    return data
  }

  getOrderState = async (orderId) => {
    return await this.api.orders.getOrderState({
      accountId: this.account,
      orderId
    })
  }

  postOrder = async (request) => {
    console.log('postOrder', request)
    return await this.api.orders.postOrder({
      accountId: this.account,
      ...request
    })
  }
}
