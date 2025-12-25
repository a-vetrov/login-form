import { configureStore } from '@reduxjs/toolkit'
import { api } from '../services/api.ts'
import { userInfoSlice } from './slices/user-slice.ts'
import { socketDataSlice } from './slices/socket-slice.ts'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [userInfoSlice.name]: userInfoSlice.reducer,
    [socketDataSlice.name]: socketDataSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
