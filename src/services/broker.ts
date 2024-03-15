import { api } from './api'

interface BrokerInfoType {
  name: string
  created: string
  id: string
}

interface ServerAnswer {
  success: boolean
}

export interface TokenDataType {
  name: string
  token: string
}

export const brokerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBrokerList: build.query<BrokerInfoType[], undefined>({
      query: () => ({
        url: 'broker/list',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as BrokerInfoType[]
    }),
    addBrokerToken: build.mutation<ServerAnswer, TokenDataType>({
      query: (data) => ({
        url: 'broker',
        method: 'PUT',
        body: data
      }),
      transformResponse: ({ data }) => data as ServerAnswer
    }),
    deleteBrokerToken: build.mutation<ServerAnswer, string>({
      query: (id) => ({
        url: 'broker',
        method: 'DELETE',
        body: { id }
      }),
      transformResponse: ({ data }) => data as ServerAnswer
    })
  })
})

export const {
  useGetBrokerListQuery,
  useAddBrokerTokenMutation,
  useDeleteBrokerTokenMutation
} = brokerApi
