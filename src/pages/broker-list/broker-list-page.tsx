import React, { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetBrokerListQuery } from '../../services/broker'
import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,

  ListItemText
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TokenIcon from '@mui/icons-material/Token'
import IconLoader from '../../components/icon-loader'
import { DeleteButton } from './components/delete-button.tsx'

export const BrokerListPage: React.FC = () => {
  const { data, error, isLoading } = useGetBrokerListQuery()

  const list = useMemo(() => {
    if (!data?.length) {
      return <p>Пока что ни одного брокера не подключено</p>
    }

    return (
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {
          data.map((item) => (
            <ListItem key={item.id} secondaryAction={
              <DeleteButton id={item.id}/>
            }>
                <ListItemAvatar>
                  <Avatar>
                    <TokenIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.created} />
            </ListItem>
          ))
        }
      </List>
    )
  }, [data])

  return (
    <>
      <MainToolbar />
      <Container maxWidth="lg">
        <h1>Список брокеров</h1>
        {isLoading && <CircularProgress />}
        {list}
        <Button variant="contained" startIcon={<IconLoader IconClass={AddIcon} />} component={RouterLink} to='/broker/add'>
          Добавить
        </Button>
      </Container>
    </>
  )
}
