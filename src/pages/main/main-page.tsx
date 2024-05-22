import React, { useMemo } from 'react'
import { userInfoSelector } from '../../store/selectors/user-info'
import { useSelector } from 'react-redux'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, Typography } from '@mui/material'
import { MarketWidget } from './market-widget'

export const MainPage: React.FC = () => {
  const userInfo = useSelector(userInfoSelector)

  const greetingMessage = useMemo(() => {
    if (userInfo?.name) {
      return `
        Привет, ${userInfo.name}! Тут будет какая-то осмысленная подпись. Можно даже выдать инвест идею от Chat GPT.
      `
    }
    return 'Добро пожаловать и всякое такое... '
  }, [userInfo?.name])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2">
          Главная страница
        </Typography>
        <Typography variant="body1">
          {greetingMessage}
        </Typography>

        <Typography variant="h3" marginY={2}>
          Обзор рынков
        </Typography>
        <MarketWidget />
      </Container>
    </>
  )
}
