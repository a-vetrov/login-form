import { getShareType } from '../details/utils'

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
        return `${getShareType(shareType as number)} ${name}`
      }
      return `Акция ${name}`
    }
    case 'bond': {
      return `Облигация ${name}`
    }
    case 'currency': {
      return `Валюта ${name}`
    }

    default: return 'Название не определено'
  }
}
