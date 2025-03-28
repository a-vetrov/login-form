import { TinkoffInvestApi } from 'tinkoff-invest-api'

export class TinkoffSandboxAccount {
  constructor ({ token, account }) {
    this.token = token
    this.account = account

    this.api = new TinkoffInvestApi({ token: token.token })
  }

  isSandbox () {
    return true
  }

  getActiveOrders = async () => {
    const data = await this.api.sandbox.getSandboxOrders({ accountId: this.account })
    return data.orders
  }

  cancelOrder = async (orderId) => {
    const data = await this.api.sandbox.cancelSandboxOrder({
      accountId: this.account,
      orderId
    })
    console.log('Order canceled', data)
    return data
  }

  getOrderState = async (orderId) => {
    return await this.api.sandbox.getSandboxOrderState({
      accountId: this.account,
      orderId
    })
  }

  postOrder = async (request) => {
    return await this.api.sandbox.postSandboxOrder({
      accountId: this.account,
      ...request
    })
  }
}
