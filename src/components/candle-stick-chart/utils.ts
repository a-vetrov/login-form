import { type OrderDataType } from '../../services/bots'
import { type ITimeScaleApi, type Logical, type Time, type Coordinate } from 'lightweight-charts'
import { getFromMoneyValue } from '../../utils/money.ts'
import { type GetCandlesResponseType } from '../../services/market-data.ts'

export const getPriceMultiplier = (product: OrderDataType['product']): number => {
  let priceMultiplier = 1

  if (product.type === 'future' && product.minPriceIncrement && product.minPriceIncrementAmount) {
    priceMultiplier = product.minPriceIncrement / product.minPriceIncrementAmount
  }

  return priceMultiplier
}

export const timeToCoordinate = (time: Time, timeScale: ITimeScaleApi<Time>): Coordinate | null => {
  const index = timeScale.timeToIndex(time, true)
  const x1 = timeScale.logicalToCoordinate(index as Logical)
  const x0 = timeScale.logicalToCoordinate((index - 1) as Logical)
  if (x1 === null || x0 === null || index === 0) {
    return null
  }
  const time0 = timeScale.coordinateToTime(x0)
  const time1 = timeScale.coordinateToTime(x1)

  if (time0 === null || time1 === null) {
    return x1
  }

  const slope = (time1 - time0) / (x1 - x0)
  return x0 + (time - time0) / slope
}

export const prepareCandlesData = (data: GetCandlesResponseType) => {
  return data.candles.map((item) => {
    return {
      time: new Date(item.time).getTime() / 1000,
      close: getFromMoneyValue(item.close),
      open: getFromMoneyValue(item.open),
      low: getFromMoneyValue(item.low),
      high: getFromMoneyValue(item.high)
    }
  })
}
