import React from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, Typography } from '@mui/material'
import { useGetBotsQuery } from '../../services/bots'

export const BotsList: React.FC = () => {
  const { data, isLoading, error } = useGetBotsQuery()

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h1" marginBottom={1}>
          Список роботов
        </Typography>
        {data?.map((item) => (
          <div key={item.id}>
            <Typography variant="body1" >type: {item.type}</Typography>
            <Typography variant="body1" >created: {item.created}</Typography>
          </div>
        ))}
      </Container>
    </>
  )
}
