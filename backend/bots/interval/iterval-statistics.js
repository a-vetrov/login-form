const createOrdersDict = (orders) => orders?.reduce((accumulator, order) => {
  accumulator.set(order.orderId, order)
  return accumulator
}, new Map())

const createStepOrdersDict = (steps) => steps?.reduce((accumulator, step) => {
  step.orders.forEach((order) => accumulator.set(order, step))
  return accumulator
}, new Map())

const getNextOrder = (order, ordersDict, stepOrdersDict) => {
  const step = stepOrdersDict.get(order.orderId)
  if (!step) {
    return undefined
  }
  let index = step.orders.indexOf(order.orderId)
  if (index < 0) {
    return undefined
  }
  index++

  while (index < step.orders.length) {
    const id = step.orders[index]
    const nextOrder = ordersDict.get(id)
    if (nextOrder && nextOrder.direction !== order.direction) {
      return nextOrder
    }
    index++
  }

  return undefined
}

const getPreviousOrder = (order, ordersDict, stepOrdersDict) => {
  const step = stepOrdersDict.get(order.orderId)
  if (!step) {
    return undefined
  }
  let index = step.orders.indexOf(order.orderId)
  if (index < 0) {
    return undefined
  }
  index--

  while (index >= 0) {
    const id = step.orders[index]
    const previousOrder = ordersDict.get(id)
    if (previousOrder && previousOrder.direction !== order.direction) {
      return previousOrder
    }
    index--
  }

  return undefined
}

export const getBotStatistics = (orders, steps, { lastPrice, product, currentPrice }) => {
  const executedOrdersLength = orders.length
  let lots = 0
  let lotsBuy = 0
  let priceBuy = 0
  let lotsSell = 0
  let priceSell = 0
  let commission = 0
  let serviceCommission = 0
  let closedPositions = 0
  let unrealizedProfit = 0
  let unrealizedProfitCurrent = 0

  const ordersDict = createOrdersDict(orders)
  const stepOrdersDict = createStepOrdersDict(steps)

  if (!ordersDict || !stepOrdersDict) {
    return null
  }

  const openOrders = orders.reduce((accumulator, item) => {
    if (item.direction === 1 && !getNextOrder(item, ordersDict, stepOrdersDict)) {
      accumulator.add(item.orderId)
    }
    return accumulator
  }, new Set())

  orders.forEach((order) => {
    const { direction, lotsExecuted, executedCommission, executedOrderPrice, initialCommission } = order

    const localCommission = executedCommission || initialCommission || 0

    if (direction === 1) {
      lotsBuy += lotsExecuted
      lots += lotsExecuted
      if (executedOrderPrice) {
        priceBuy += executedOrderPrice
      }
    } else {
      lotsSell += lotsExecuted
      lots -= lotsExecuted
      if (executedOrderPrice) {
        priceSell += executedOrderPrice
        const prevOrder = getPreviousOrder(order, ordersDict, stepOrdersDict)
        if (prevOrder && prevOrder.executedOrderPrice) {
          const prevCommission = prevOrder.executedCommission || prevOrder.initialCommission || 0
          const localProfit = executedOrderPrice - prevOrder.executedOrderPrice - localCommission - prevCommission
          closedPositions += localProfit
        }
      }
    }

    commission += localCommission

    if (order.serviceCommission) {
      serviceCommission += order.serviceCommission
    }
  })

  let priceMultiplier = 1

  if (product.type === 'future' && product.minPriceIncrement && product.minPriceIncrementAmount) {
    priceMultiplier = product.minPriceIncrementAmount / product.minPriceIncrement
  }

  openOrders.forEach(({ direction, lotsExecuted, executedCommission, executedOrderPrice, initialCommission, previousOrderId }) => {
    const openCommission = executedCommission || initialCommission || 0
    const last = (lotsExecuted * product.lot * lastPrice * priceMultiplier)
    const current = (lotsExecuted * product.lot * currentPrice * priceMultiplier)
    const delta = last - executedOrderPrice - openCommission
    const deltaCurrent = current - executedOrderPrice - openCommission
    unrealizedProfit += delta
    unrealizedProfitCurrent += deltaCurrent
  })

  openOrders.clear()
  ordersDict.clear()
  stepOrdersDict.clear()

  return {
    executedOrdersLength, lotsBuy, lotsSell, lots, commission, serviceCommission, priceBuy, priceSell, closedPositions, unrealizedProfit, unrealizedProfitCurrent
  }
}
