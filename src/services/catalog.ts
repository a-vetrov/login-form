import { api } from './api'

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['CatalogBonds', 'CatalogStocks', 'CatalogCurrencies'] })

export const catalogApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
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
    })
  })
})
