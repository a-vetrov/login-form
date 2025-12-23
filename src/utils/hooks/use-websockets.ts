import { useSelector } from 'react-redux'
import { userInfoSelector } from '../../store/selectors/user-info.ts'
import { useEffect } from 'react'

export const useWebsockets = (): void => {
  const userInfo = useSelector(userInfoSelector)

  useEffect(() => {
    if (!userInfo || !window) {
      return
    }

    const url = `ws://${window.location.host}`

    const socket = new WebSocket(url)

    socket.onopen = function (event) {
      console.log('Соединение WebSocket установлено!', event)

      setTimeout(function () {
        socket.send((new Date().toLocaleString()))
      }, 3000)
    }

    socket.onmessage = function (event) {
      console.log('Получены данные:', event.data)

      setTimeout(function () {
        socket.send((new Date().toLocaleString()))
      }, 500)
    }

    socket.onerror = function (error) {
      console.error('Ошибка WebSocket:', error)
    }

    socket.onclose = function (event) {
      console.log('Соединение WebSocket закрыто:', event.code, event.reason)
    }
  }, [userInfo])
}
