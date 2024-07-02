import { api } from './api'

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['LastPrice'] })

export const marketDataApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getLastPrice: build.query<unknown, string>({
      query: (instrumentId) => ({
        url: `last-price/${instrumentId}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data
    })
  })
})
