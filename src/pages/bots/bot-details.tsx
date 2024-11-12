import React, { useMemo } from 'react'
import { useGetBotByIdQuery } from '../../services/bots'
import { useMatch } from 'react-router-dom'
import { MainToolbar } from '../../components/main-toolbar'
import { CircularProgress, Container } from '@mui/material'
import { getBotDetailsView } from './details/details-factory'

export const BotDetails: React.FC = () => {
  const match = useMatch('/bots/:id')

  const { data, isLoading } = useGetBotByIdQuery(match?.params.id as unknown as string)

  const BotComponent = useMemo(() => {
    if (!data) {
      return null
    }
    return getBotDetailsView(data.type)
  }, [data])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        {isLoading && <CircularProgress />}
        {BotComponent && data && <BotComponent data={data}/>}
      </Container>
    </>
  )
}
