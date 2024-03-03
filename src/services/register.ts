import { api } from './api'

interface UserData {
  email: string
  password: string
}

interface ServerAnswer {
  success: boolean
}

export const registerApi = api.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<UserData, ServerAnswer>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data
      })
    })
  })
})

export const { useRegisterUserMutation } = registerApi
