import { api } from './api'

interface ServerAnswer {
  success: boolean
}

export const registerApi = api.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<ServerAnswer, FormData>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data
      })
    })
  })
})

export const { useRegisterUserMutation } = registerApi
