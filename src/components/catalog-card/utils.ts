import { dotDelimiter } from '../../constants'

interface GetIsinStringProps {
  isin?: string
  ticker?: string
}
export const getIsinString = ({ isin, ticker }: GetIsinStringProps): string | null => {
  const arr = []
  if (isin) {
    arr.push(isin)
  }
  if (ticker && ticker !== isin) {
    arr.push(ticker)
  }

  if (arr.length > 0) {
    return arr.join(dotDelimiter)
  }

  return null
}

export const getColor = (value: number | undefined): string | undefined => {
  if (!value) {
    return 'text.secondary'
  }

  if (value > 0) {
    return 'success.dark'
  }

  if (value < 0) {
    return 'warning.dark'
  }
}
