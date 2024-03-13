import { api } from './api'

interface BrokerInfoType {
  name: string
  created: string
}

export const brokerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBrokerList: build.query<BrokerInfoType[], undefined>({
      query: () => ({
        url: 'broker/list',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as BrokerInfoType[]
    })
  })
})

export const { useGetBrokerListQuery } = brokerApi
