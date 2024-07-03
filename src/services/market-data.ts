import { api } from './api'
import { type Quotation } from '../types/tinkoff/common'

export interface LastPriceType {
  figi: string
  price: Quotation
  time: string
  instrumentUid: string
}

export interface LastPriceResponseType {
  lastPrices: LastPriceType[]
}

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['LastPrice'] })

export const marketDataApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getLastPrice: build.query<LastPriceResponseType, string>({
      query: (instrumentId) => ({
        url: `market-data/last-price/${instrumentId}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as LastPriceResponseType,
      providesTags: ['LastPrice']
    })
  })
})
