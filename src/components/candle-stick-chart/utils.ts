import { type OrderDataType } from '../../services/bots'

export const getPriceMultiplier = (product: OrderDataType['product']): number => {
  let priceMultiplier = 1

  if (product.type === 'future' && product.minPriceIncrement && product.minPriceIncrementAmount) {
    priceMultiplier = product.minPriceIncrement / product.minPriceIncrementAmount
  }

  return priceMultiplier
}
