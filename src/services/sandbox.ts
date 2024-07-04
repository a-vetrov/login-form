import { api } from './api'
import { type Account } from '../types/tinkoff/users'

interface AccountsApiType {
  success: boolean
  data: {
    accounts: Account[]
  }
}

interface AccountsCreateApiType {
  success: boolean
  data: {
    id: string
  }
}

interface AddMoneyParamsType {
  id: string
  money: number
}

export interface PostNewOrderParamsType {
  quantity: number
  price: number
  direction: number
  account_id: string
  order_type: number
  instrument_id: string
  time_in_force: number
  price_type: number
}

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['SandboxAccounts', 'CurrentAccount'] })

export const sandboxApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query<AccountsApiType['data'], undefined>({
      query: () => ({
        url: 'sandbox/accounts',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as AccountsApiType['data'],
      providesTags: ['SandboxAccounts']
    }),
    createAccount: build.mutation<AccountsCreateApiType['data'], undefined>({
      query: () => ({
        url: 'sandbox/accounts/create',
        method: 'POST'
      }),
      transformResponse: ({ data }) => data as AccountsCreateApiType['data'],
      invalidatesTags: ['SandboxAccounts']
    }),
    deleteAccount: build.mutation<AccountsCreateApiType['data'], string>({
      query: (id) => ({
        url: `sandbox/accounts/${id}`,
        method: 'DELETE'
      }),
      transformResponse: ({ data }) => data as AccountsCreateApiType['data'],
      invalidatesTags: ['SandboxAccounts']
    }),
    addNewMoney: build.mutation<AccountsCreateApiType['data'], AddMoneyParamsType>({
      query: (data) => ({
        url: 'sandbox/accounts/add-money',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['CurrentAccount']
    }),
    getSandboxPortfolio: build.query<unknown, string>({
      query: (accountId) => ({
        url: `sandbox/portfolio?accountId=${accountId}`,
        method: 'GET'
      }),
      transformResponse: ({ data }) => data,
      providesTags: () => ['CurrentAccount']
    }),
    postNewOrder: build.mutation<AccountsCreateApiType['data'], PostNewOrderParamsType>({
      query: (data) => ({
        url: 'sandbox/post-order',
        method: 'POST',
        body: data
      })
    })
  })
})
