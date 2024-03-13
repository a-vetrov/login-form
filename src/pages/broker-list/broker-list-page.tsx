import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetBrokerListQuery } from '../../services/broker'
import { Button, Container } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import IconLoader from '../../components/icon-loader'

export const BrokerListPage: React.FC = () => {
  const { data, error, isLoading } = useGetBrokerListQuery()

  console.log({ data, error, isLoading })

  return (
    <>
      <MainToolbar />
      <Container maxWidth="lg">
        <h1>Список брокеров</h1>
        <p>Пока что ни одного брокера не подключено</p>
        <Button variant="contained" startIcon={<IconLoader IconClass={AddIcon} />} component={RouterLink} to='/broker/add'>
          Добавить
        </Button>
      </Container>
    </>
  )
}
