import type { PortfolioPosition } from '../../types/tinkoff/operations.ts'
import { getFromMoneyValue } from '../../utils/money.ts'

const DELIMITER = '*'

export const getProductDetails = (product: PortfolioPosition): string | null => {
  const arr = []

  const count = getFromMoneyValue(product.quantity)
  if (count !== undefined && product.instrumentType !== 'currency') {
    arr.push(`${count.toLocaleString('ru-RU')} шт.`)
  }
  return arr.length > 0 ? arr.join(DELIMITER) : null
}

export const getProductTotalDetails = (product: PortfolioPosition): string | undefined => {
  const expectedYield = getFromMoneyValue(product.expectedYield)
  return expectedYield !== undefined ? `${expectedYield} %` : undefined
}
