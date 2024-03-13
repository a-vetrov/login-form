import { api } from './api'
import { type UserInfo } from '../store/slices/user-slice.ts'

interface ServerAnswer {
  success: boolean
  userInfo?: UserInfo
}

export const loginApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<ServerAnswer, unknown>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data
      }),
      transformResponse: ({ data }) => data as ServerAnswer
    }),
    getUserInfo: build.query<ServerAnswer, undefined>({
      query: () => ({
        url: 'user-info',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as ServerAnswer
    })
  })
})

export const { useLoginUserMutation, useLazyGetUserInfoQuery } = loginApi
