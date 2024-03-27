import { api } from './api'

export enum TokenType {
  real = 'real',
  sandbox = 'sandbox'
}

interface BrokerInfoType {
  name: string
  created: string
  id: string
  type: TokenType
}

interface ServerAnswer {
  success: boolean
}

export interface TokenDataType {
  name: string
  token: string
}

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['Broker'] })

export const brokerApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getBrokerList: build.query<BrokerInfoType[], undefined>({
      query: () => ({
        url: 'broker/list',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as BrokerInfoType[],
      providesTags: ['Broker']
    }),
    addBrokerToken: build.mutation<ServerAnswer, TokenDataType>({
      query: (data) => ({
        url: 'broker',
        method: 'PUT',
        body: data
      }),
      transformResponse: ({ data }) => data as ServerAnswer,
      invalidatesTags: ['Broker']
    }),
    deleteBrokerToken: build.mutation<ServerAnswer, string>({
      query: (id) => ({
        url: 'broker',
        method: 'DELETE',
        body: { id }
      }),
      transformResponse: ({ data }) => data as ServerAnswer,
      invalidatesTags: ['Broker']
    })
  })
})

export const {
  useGetBrokerListQuery,
  useAddBrokerTokenMutation,
  useDeleteBrokerTokenMutation
} = brokerApi
