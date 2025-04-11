import type { HistoricCandle } from '../../../types/tinkoff/marketdata'
import { getFromMoneyValue } from '../../../utils/money'
import { getMinMax } from '../../../utils/math'
import type { SxProps } from '@mui/system'
import type { Theme } from '@mui/material'

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
  productLots?: number
  initialMarginOnBuy?: number
}

export const calculateBudget = ({ lowBoundary, highBoundary, stepsCount, amountPerStep, productLots, initialMarginOnBuy }: CalculateBudgetProps): number => {
  if (lowBoundary === undefined || highBoundary === undefined || lowBoundary === highBoundary || !stepsCount || !amountPerStep || !productLots) {
    return 0
  }

  if (initialMarginOnBuy) {
    return initialMarginOnBuy * stepsCount
  }

  const { min, max } = getMinMax(lowBoundary, highBoundary)
  const stepSize = (max - min) / (stepsCount - 1)
  let result = 0
  for (let i = lowBoundary; i <= highBoundary; i += stepSize) {
    result += i * amountPerStep * productLots
  }
  return result
}

export const getColorSx = (value?: number): SxProps<Theme> | null => {
  if (!value) {
    return null
  }
  return {
    color: value > 0 ? 'success.main' : 'error.light'
  }
}
