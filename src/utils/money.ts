import { type MoneyValue, type Quotation } from '../types/tinkoff/common'
import { type PortfolioPosition } from '../types/tinkoff/operations'
import { IMask } from 'react-imask'

import round from 'lodash.round'

const RUB = '₽'
const USD = '$'
const EUR = '€'

export const mainCurrencies = { RUB, USD, EUR }

export type CurrencyCodeType = keyof typeof mainCurrencies

const FIGI_RUB = 'RUB000UTSTOM'

const isRubCurrency = (product: PortfolioPosition): boolean => {
  return product.figi === FIGI_RUB
}

export const getCurrencySign = (currency?: string): string => {
  if (!currency) {
    return ''
  }
  const toUpperCase = currency.toUpperCase()
  return mainCurrencies[toUpperCase as keyof typeof mainCurrencies] || toUpperCase
}

export const getFromMoneyValue = (value?: MoneyValue | Quotation | number): number | undefined => {
  if (typeof value === 'number') {
    return value
  }

  if (!value) {
    return undefined
  }

  return value.units + value.nano / 1000000000
}

const localeOptions = {
  minimumFractionDigits: 2, maximumFractionDigits: 2
}

export const fromNumberToMoneyString = (total: number, currency?: string): string => `${total.toLocaleString('ru-RU', localeOptions)} ${getCurrencySign(currency)}`

export const toMoneyString = (value?: MoneyValue): string => {
  const total = getFromMoneyValue(value)

  if (!total) {
    return ''
  }

  return fromNumberToMoneyString(total, value?.currency)
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

const toNumberPipe = IMask.createPipe({
  mask: Number,
  scale: 2,
  thousandsSeparator: ' '
}, IMask.PIPE_TYPE.MASKED, IMask.PIPE_TYPE.TYPED)

export const getFromMaskedValue = (s: string | null): number | null => {
  if (s === null) {
    return null
  }

  return toNumberPipe(s)
}

export const setMaskedValue = IMask.createPipe({
  mask: Number,
  scale: 2,
  thousandsSeparator: ' '
}, IMask.PIPE_TYPE.TYPED, IMask.PIPE_TYPE.MASKED)

export const roundToMinPriceIncrement = (value: number, minPriceIncrement?: number): number => {
  if (!minPriceIncrement) {
    return round(value, 2)
  }
  const n = Math.round(value / minPriceIncrement)
  return round(n * minPriceIncrement, 4)
}
