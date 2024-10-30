import { api } from './api'
import { type ExtendedAccountData } from './sandbox'

export const portfolioApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPortfolio: build.query<ExtendedAccountData, undefined>({
      query: () => ({
        url: 'portfolio',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as ExtendedAccountData
    })
  })
})

export const {
  useGetPortfolioQuery
} = portfolioApi
