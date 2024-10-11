import { getShareType } from '../pages/details/utils'

export const getInstrumentName = (data?: Record<string, unknown>): string => {
  if (!data) {
    return 'Название не определено'
  }

  const { name, type, shareType } = data

  if (!name) {
    return 'Название не определено'
  }

  switch (type) {
    case 'stock' : {
      if (shareType !== undefined) {
        return `${getShareType(shareType as number)} ${name as string}`
      }
      return `Акция ${name as string}`
    }
    case 'bond': {
      return `Облигация ${name as string}`
    }
    case 'currency': {
      return `Валюта ${name as string}`
    }

    default: return 'Название не определено'
  }
}
