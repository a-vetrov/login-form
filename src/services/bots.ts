import { api } from './api'
import { type AccountTypes } from '../constants'

export interface AddIntervalBotData {
  product?: string
  bounds?: {
    min: number
    max: number
  }
  stepsCount?: number
  amountPerStep?: number
  accountType: AccountTypes
  selectedAccount?: string
}

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['BotsList'] })

export const botsApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    addIntervalBot: build.mutation<unknown, AddIntervalBotData>({
      query: (data) => ({
        url: 'bots/interval-bot',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['BotsList']
    }),
    getBots: build.query<unknown, undefined>({
      query: () => ({
        url: 'bots',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: ['BotsList']
    })
  })
})

export const { useAddIntervalBotMutation, useGetBotsQuery } = botsApi
