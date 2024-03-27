import { api } from './api'
import { type Account } from '../types/tinkoff/users.ts'

interface AccountsApiType {
  success: boolean
  data: {
    accounts: Account[]
  }
}


export const sandboxApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query<AccountsApiType['data'], undefined>({
      query: () => ({
        url: 'sandbox/accounts',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as AccountsApiType['data']
    })
  })
})
