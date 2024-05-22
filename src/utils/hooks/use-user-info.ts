import { useLazyGetUserInfoQuery } from '../../services/login'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userInfoSelector } from '../../store/selectors/user-info'
import { type UserInfo, userInfoSlice } from '../../store/slices/user-slice'

interface UseUserInfoReturnType {
  userInfo: UserInfo | null
  isLoading: boolean
  isAuth: boolean
}

/**
 * Проверяем авторизацию и возвращаем UserInfo
 */
export const useUserInfo = (): UseUserInfoReturnType => {
  const userInfo = useSelector(userInfoSelector)
  const [trigger, { data, isFetching, isUninitialized, error }] = useLazyGetUserInfoQuery()
  const dispatch = useDispatch()

  useEffect(() => {
    if (userInfo == null && !isFetching) {
      void trigger()
    }
  }, [userInfo])

  useEffect(() => {
    if (!isFetching && data?.userInfo && !userInfo) {
      dispatch(userInfoSlice.actions.update(data.userInfo))
    }
  }, [error, data])

  const result = userInfo ?? data?.userInfo ?? null

  return {
    userInfo: result,
    isLoading: isFetching || (isUninitialized && result === null),
    isAuth: result !== null
  }
}
