import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserInfo {
  email: string
  name: string
  role: string
}

type StateType = UserInfo | null

const initialState: StateType = null as StateType

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<UserInfo>) => action.payload,
    logout: () => null
  }
})
