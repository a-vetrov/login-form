import { api } from './api'

export type CatalogProductType = 'bond' | 'stock' | 'currency' | 'future'

export interface GetCatalogResponseType {
  name: string
  isin: string
  figi: string
  ticker: string
  uid: string
  lot: number
  minPriceIncrement?: number
  type: CatalogProductType
}

export interface GetFutureMarginType {
  initialMarginOnBuy: number
  initialMarginOnSell: number
  minPriceIncrement: number
  minPriceIncrementAmount: number
}

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['CatalogBonds', 'CatalogStocks', 'CatalogCurrencies', 'CatalogFutures'] })

export const catalogApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getCatalog: build.query<GetCatalogResponseType[], undefined>({
      query: () => ({
        url: 'catalog',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as GetCatalogResponseType[]
    }),
    getBonds: build.query<unknown, undefined>({
      query: () => ({
        url: 'catalog/bonds',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: ['CatalogBonds']
    }),
    getBondsByIsin: build.query<unknown, string>({
      query: (isin) => ({
        url: `catalog/bonds/${isin}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data
    }),
    getStocks: build.query<unknown, undefined>({
      query: () => ({
        url: 'catalog/stocks',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: ['CatalogStocks']
    }),
    getStocksByIsin: build.query<unknown, string>({
      query: (isin) => ({
        url: `catalog/stocks/${isin}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data
    }),
    getCurrencies: build.query<unknown, undefined>({
      query: () => ({
        url: 'catalog/currency',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: ['CatalogCurrencies']
    }),
    getCurrencyByTicker: build.query<unknown, string>({
      query: (ticker) => ({
        url: `catalog/currency/${ticker}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data
    }),
    getFutures: build.query<unknown, undefined>({
      query: () => ({
        url: 'catalog/futures',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: ['CatalogFutures']
    }),
    getFutureByTicker: build.query<unknown, string>({
      query: (ticker) => ({
        url: `catalog/futures/${ticker}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data
    }),
    getFutureMarginByTicker: build.query<GetFutureMarginType, string>({
      query: (ticker) => ({
        url: `catalog/futures/${ticker}/margin`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as GetFutureMarginType
    }),
    getInstrumentByIsin: build.query<unknown, string>({
      query: (isin) => ({
        url: `catalog/instrument/${isin}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data
    })
  })
})
