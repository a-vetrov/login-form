import { api } from './api'
import { type PortfolioResponse } from '../types/tinkoff/operations.ts'
import {Account} from "../types/tinkoff/users.ts";

interface PortfolioApiType {
  success: boolean
  data: {
    portfolio: PortfolioResponse
    accounts: Account[]
  }
}

export const portfolioApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPortfolio: build.query<PortfolioApiType['data'], undefined>({
      query: () => ({
        url: 'portfolio',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as PortfolioApiType['data']
    })
  })
})

export const {
  useGetPortfolioQuery
} = portfolioApi
