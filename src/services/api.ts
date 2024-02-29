import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (build) => ({
    registerUser: build.query({
      query: () => 'register'
    })
  })
})

export const {
  useLazyRegisterUserQuery
} = api
