import { type LastPriceResponseType, type LastPriceType } from '../../services/market-data'
import { toMoneyString } from '../../utils/money'

export const getLastPrice = (uid?: string, data?: LastPriceResponseType): string | null => {
  if (!data || !uid) {
    return null
  }

  const info: LastPriceType | undefined = data.lastPrices.find((item => item.instrumentUid === uid))

  if (info) {
    return toMoneyString({ ...info.price, currency: 'RUB' })
  }

  return null
}
