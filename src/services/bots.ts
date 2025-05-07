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

export interface IntervalBotStepParams {
  min: number
  max: number
  serialNumber: number
}

export interface BotsListDataType {
  type: BotsType
  active: boolean
  created: string
  accountType: AccountTypes
  selectedAccount: string
  properties: Record<string, unknown>
  id: string
  steps?: IntervalBotStepParams[]
}

export interface OrderDataType {
  orderId: string
  botId: string
  status: number
  direction: number
  executionDate: string
  orderDate: string
  previousOrderId: string
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
  product: {
    isin: string
    figi: string
    uid: string
    name: string
    type: string
    lot: number
    minPriceIncrement?: number
    minPriceIncrementAmount?: number
  }
}

export interface IntervalStepInfo {
  state: string
  orderId?: string
  bounds: { min: number, max: number }
  orders: string[]
  serialNumber: number
}

export interface OrdersListDataType {
  orders: OrderDataType[]
  ordersAll?: OrderDataType[]
  steps?: IntervalStepInfo[]
}

export interface BotStatisticsType {
  commission?: number
  currentPrice?: number
  executedOrdersLength?: number
  lastPrice?: number
  lots?: number
  lotsBuy?: number
  lotsSell?: number
  priceBuy?: number
  priceSell?: number
  serviceCommission?: number
  closedPositions?: number
  product: {
    isin: string
    figi: string
    uid: string
    name: string
    type: string
    lot: number
    minPriceIncrement?: number
    minPriceIncrementAmount?: number
  }
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
    getBotStatistics: build.query<BotStatisticsType, string>({
      query: (id) => ({
        url: `bots/${id}/stats`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as BotStatisticsType
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
  useLazyGetBotOrdersQuery,
  useGetBotStatisticsQuery,
  useStopBotMutation
} = botsApi
