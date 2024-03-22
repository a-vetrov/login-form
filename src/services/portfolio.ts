import { api } from './api'


interface ServerAnswer {
  success: boolean
}

export const portfolioApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPortfolio: build.query<ServerAnswer, undefined>({
      query: () => ({
        url: 'portfolio',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as ServerAnswer
    })
  })
})

export const {
  useGetPortfolioQuery
} = portfolioApi
