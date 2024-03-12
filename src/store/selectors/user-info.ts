import { type RootState } from '../index.ts'
import { type UserInfo } from '../slices/user-slice.ts'

export const userInfoSelector = (state: RootState): UserInfo | null => state.userInfo
