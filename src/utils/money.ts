import { type MoneyValue, type Quotation } from '../types/tinkoff/common'
import { type PortfolioPosition } from '../types/tinkoff/operations'

const RUB = '₽'
const USD = '$'
const EUR = '€'

const mainCurrencies = { RUB, USD, EUR }

const FIGI_RUB = 'RUB000UTSTOM'

const isRubCurrency = (product: PortfolioPosition): boolean => {
  return product.figi === FIGI_RUB
}

const getCurrencySign = (currency: string): string => {
  const toUpperCase = currency.toUpperCase()
  return mainCurrencies[toUpperCase as keyof typeof mainCurrencies] || toUpperCase
}

export const getFromMoneyValue = (value?: MoneyValue | Quotation): number | undefined => {
  return (value ? value.units + value.nano / 1000000000 : undefined)
}

export const toMoneyString = (value?: MoneyValue): string => {
  const total = getFromMoneyValue(value)

  if (!total) {
    return ''
  }

  return `${total.toLocaleString('ru-RU')} ${getCurrencySign(value.currency)}`
}

export const getProductTotal = (product: PortfolioPosition): number | undefined => {
  const price = isRubCurrency(product) ? 1 : getFromMoneyValue(product.currentPrice)
  const count = getFromMoneyValue(product.quantity)
  const nkd = getFromMoneyValue(product.currentNkd) ?? 0

  if (price === undefined || count === undefined) {
    return undefined
  }
  // TODO Проверить при количестве штук больше 1
  return (price + nkd) * count
}

export const getProductTotalString = (product: PortfolioPosition): string | null => {
  const total = getProductTotal(product)
  if (total === undefined) {
    return null
  }
  return `${total.toLocaleString('ru-RU')} ${RUB}`
}
