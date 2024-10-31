import type { HistoricCandle } from '../../../types/tinkoff/marketdata'
import { getFromMoneyValue } from '../../../utils/money'
import { getMinMax } from '../../../utils/math'

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

interface CalculateBudgetProps {
  lowBoundary?: number
  highBoundary?: number
  stepsCount?: number
  amountPerStep?: number
}

export const calculateBudget = ({ lowBoundary, highBoundary, stepsCount, amountPerStep }: CalculateBudgetProps): number => {
  if (lowBoundary === undefined || highBoundary === undefined || lowBoundary === highBoundary || !stepsCount || !amountPerStep) {
    return 0
  }
  const { min, max } = getMinMax(lowBoundary, highBoundary)
  const stepSize = (max - min) / (stepsCount - 1)
  let result = 0
  for (let i = lowBoundary; i <= highBoundary; i += stepSize) {
    result += i * amountPerStep
  }
  return result
}