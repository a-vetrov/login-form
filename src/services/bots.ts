import { api } from './api'
import { type AccountTypes, type BotsType } from '../constants'

export interface AddIntervalBotData {
  product?: string
  bounds?: {
    min: number
    max: number
  }
  stepsCount?: number
  stepProfit?: number
  amountPerStep?: number
  accountType: AccountTypes
  selectedAccount?: string
}

interface AddIntervalBotResponseType {
  id: string
}

export interface BotsListDataType {
  type: BotsType
  active: boolean
  created: string
  accountType: AccountTypes
  selectedAccount: string
  properties: Record<string, unknown>
  id: string
}

export interface OrderDataType {
  orderId: string
  botId: string
  status: number
  direction: number
  executionDate: string
  orderDate: string
  lotsRequested: number
  lotsExecuted: number
  initialOrderPrice: number
  executedOrderPrice: number
  totalOrderAmount: number
  averagePositionPrice: number
  initialCommission: number
  executedCommission: number
  initialSecurityPrice: number
  serviceCommission: number
  properties: {
    price: number
    quantity: number
  }
  date: string
}

export interface IntervalStepInfo {
  state: string
  orderId?: string
  bounds: { min: number, max: number }
  orders: string[]
}

export interface OrdersListDataType {
  orders: OrderDataType[]
  steps?: IntervalStepInfo[]
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
      transformResponse: ({ data }) => data as BotsListDataType,
      providesTags: (result, error, id) => [{ type: 'BotsList', id }]
    }),
    getBotOrders: build.query<OrdersListDataType, string>({
      query: (id) => ({
        url: `bots/${id}/orders`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as OrdersListDataType
    }),
    stopBot: build.mutation<BotsListDataType, string>({
      query: (id) => ({
        url: `bots/${id}/stop`,
        method: 'PUT'
      }),
      invalidatesTags: ['BotsList']
    })
  })
})

export const {
  useAddIntervalBotMutation,
  useGetBotsQuery,
  useGetBotByIdQuery,
  useGetBotOrdersQuery,
  useStopBotMutation
} = botsApi
