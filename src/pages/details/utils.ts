import { dotDelimiter } from '../../constants'

export const getIds = (data?: Record<string, string>): string | null => {
  if (!data) {
    return null
  }
  const result = []

  if (data.isin) {
    result.push(data.isin)
  }
  if (data.ticker) {
    result.push(data.ticker)
  }
  if (data.figi) {
    result.push(data.figi)
  }

  return result.join(dotDelimiter)
}
