import { api } from './api'

interface ServerAnswer {
  success: boolean
}

export const loginApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<ServerAnswer, unknown>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data
      })
    })
  })
})

export const { useLoginUserMutation } = loginApi
