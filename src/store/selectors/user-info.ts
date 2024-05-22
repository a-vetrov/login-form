import { type RootState } from '../index'
import { type UserInfo } from '../slices/user-slice'

export const userInfoSelector = (state: RootState): UserInfo | null => state.userInfo
