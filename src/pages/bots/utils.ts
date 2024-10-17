import type { HistoricCandle } from '../../types/tinkoff/marketdata'
import { getFromMoneyValue } from '../../utils/money'

interface IntervalType {
  low: number
  high: number
}

export const getCandlesInterval = (candles: HistoricCandle[]): IntervalType => {
  const arr: number[] = candles.reduce<number[]>((accumulator, item) => {
    const high = getFromMoneyValue(item.high)
    if (high !== undefined) {
      accumulator.push(high)
    }
    const low = getFromMoneyValue(item.low)
    if (low !== undefined) {
      accumulator.push(low)
    }
    return accumulator
  }, [])
  const low = Math.min(...arr)
  const high = Math.max(...arr)
  const quarter = (high - low) / 4
  return {
    low: low + quarter,
    high: high - quarter
  }
}
