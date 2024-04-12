import { useLazyGetUserInfoQuery } from '../../services/login'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userInfoSelector } from '../../store/selectors/user-info'
import { type UserInfo } from '../../store/slices/user-slice'

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
  const [trigger, { data, isLoading, isUninitialized }] = useLazyGetUserInfoQuery()

  useEffect(() => {
    if (userInfo == null) {
      void trigger()
    }
  }, [userInfo])

  const result = userInfo ?? data?.userInfo ?? null

  return {
    userInfo: result,
    isLoading: isLoading || (isUninitialized && result === null),
    isAuth: result !== null
  }
}
