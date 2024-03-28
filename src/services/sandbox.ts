import { api } from './api'
import { type Account } from '../types/tinkoff/users.ts'

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

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['SandboxAccounts'] })

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
    })
  })
})
