import { useDispatch, useSelector } from 'react-redux'
import { userInfoSelector } from '../../store/selectors/user-info.ts'
import { useEffect } from 'react'
import { socketDataSlice } from '../../store/slices/socket-slice.ts'

export const useWebsockets = (): void => {
  const userInfo = useSelector(userInfoSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userInfo || !window) {
      return
    }

    const url = `ws://${window.location.host}`

    const socket = new WebSocket(url)

    socket.onopen = function (event) {
      console.log('Соединение WebSocket установлено!', event)
      dispatch(socketDataSlice.actions.updateReadyState(true))
    }

    socket.onmessage = function (event) {
      console.log('Получены данные:', event.data)
    }

    socket.onerror = function (error) {
      console.error('Ошибка WebSocket:', error)
    }

    socket.onclose = function (event) {
      console.log('Соединение WebSocket закрыто:', event.code, event.reason)
      socketDataSlice.actions.updateReadyState(false)
    }

    return () => {
      socket.close()
    }
  }, [dispatch, userInfo])
}
