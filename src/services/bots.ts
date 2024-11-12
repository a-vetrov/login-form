import { api } from './api'
import { type AccountTypes, type BotsType } from '../constants'

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

interface AddIntervalBotResponseType {
  id: string
}

export interface BotsListDataType {
  type: BotsType
  created: string
  accountType: AccountTypes
  selectedAccount: string
  properties: Record<string, unknown>
  id: string
}

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['BotsList'] })

export const botsApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    addIntervalBot: build.mutation<AddIntervalBotResponseType, AddIntervalBotData>({
      query: (data) => ({
        url: 'bots/interval-bot',
        method: 'POST',
        body: data
      }),
      transformResponse: ({ data }) => data as AddIntervalBotResponseType,
      invalidatesTags: ['BotsList']
    }),
    getBots: build.query<BotsListDataType[], undefined>({
      query: () => ({
        url: 'bots',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as BotsListDataType[],
      providesTags: ['BotsList']
    }),
    getBotById: build.query<BotsListDataType, string>({
      query: (id) => ({
        url: `bots/${id}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as BotsListDataType
    })
  })
})

export const { useAddIntervalBotMutation, useGetBotsQuery, useGetBotByIdQuery } = botsApi
