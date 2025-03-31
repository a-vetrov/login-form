import round from 'lodash.round'

export const roundToMinPriceIncrement = (value, minPriceIncrement) => {
  if (!minPriceIncrement) {
    return round(value, 2)
  }
  const n = Math.round(value / minPriceIncrement)
  return round(n * minPriceIncrement, 4)
}
