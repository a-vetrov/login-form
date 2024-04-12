import { api } from './api'
import { type UserInfo } from '../store/slices/user-slice'

interface ServerAnswer {
  userInfo?: UserInfo
}

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['UserInfo'] })

export const loginApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<ServerAnswer, unknown>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data
      }),
      transformResponse: ({ data }) => data as ServerAnswer
    }),
    logoutUser: build.mutation<ServerAnswer, undefined>({
      query: () => ({
        url: 'logout',
        method: 'POST'
      }),
      transformResponse: ({ data }) => data as ServerAnswer,
      invalidatesTags: ['UserInfo']
    }),
    getUserInfo: build.query<ServerAnswer, undefined>({
      query: () => ({
        url: 'user-info',
        method: 'GET'
      }),
      transformResponse: ({ data }) => data as ServerAnswer,
      providesTags: ['UserInfo']
    })
  })
})

export const { useLoginUserMutation, useLazyGetUserInfoQuery } = loginApi
