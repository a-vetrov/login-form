import { api } from './api'

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['CatalogBonds', 'CatalogStocks'] })

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
    getStocks: build.query<unknown, undefined>({
      query: () => ({
        url: 'catalog/stocks',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: ['CatalogStocks']
    })
  })
})
