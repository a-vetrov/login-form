import React, { useEffect } from 'react'

export const YandexLoginPage: React.FC = () => {
  useEffect(() => {
    window.location.reload()
  }, [])

  return (
    <div>
      Redirecting to Yandex login page...
    </div>
  )
}
