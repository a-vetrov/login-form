import React from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { CircularProgress, Container, Typography } from '@mui/material'
import { useGetBotsQuery } from '../../services/bots'
import { BotListCard } from './bots-list/bot-card'
import { ErrorAlert } from '../../components/error-alert/error-alert'

export const BotsList: React.FC = () => {
  const { data, isLoading, error } = useGetBotsQuery()

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h1" marginBottom={1}>
          Список роботов
        </Typography>
        {isLoading && <CircularProgress />}
        <ErrorAlert error={error} />
        {data?.map((item) => (
          <BotListCard data={item} key={item.id} />
        ))}
      </Container>
    </>
  )
}
