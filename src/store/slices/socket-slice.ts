import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SocketDataType {
  ready: boolean
}

const initialState: SocketDataType = {
  ready: false
} satisfies SocketDataType

export const socketDataSlice = createSlice({
  name: 'socketData',
  initialState,
  reducers: {
    updateReadyState: (state, action: PayloadAction<boolean>) => ({ ...state, ready: action })
  }
})
