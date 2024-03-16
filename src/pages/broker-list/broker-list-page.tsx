import React, { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { format } from 'date-fns'
import { MainToolbar } from '../../components/main-toolbar'
import { useGetBrokerListQuery } from '../../services/broker'
import {
  Alert,
  Avatar, Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,

  ListItemText, Paper, Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TokenIcon from '@mui/icons-material/Token'
import IconLoader from '../../components/icon-loader'
import { DeleteButton } from './components/delete-button.tsx'

export const BrokerListPage: React.FC = () => {
  const { data, error, isLoading } = useGetBrokerListQuery()

  const list = useMemo(() => {
    if (isLoading) {
      return null
    }

    if (error) {
      return (
        <Box marginTop={2} marginBottom={2}>
          <Alert severity="warning">
            Ошибка загрузки списка токенов
          </Alert>
        </Box>
      )
    }

    if (!data?.length) {
      return <p>Пока что ни одного брокера не подключено</p>
    }

    return (
      <Paper elevation={1}>
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
                  <ListItemText primary={item.name} secondary={format(item.created, 'dd.MM.yyyy HH:mm')} />
              </ListItem>
            ))
          }
        </List>
    </Paper>
    )
  }, [data, error, isLoading])

  return (
    <>
      <MainToolbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Список брокеров
        </Typography>
        {isLoading && <CircularProgress />}
        {list}
        <Box marginTop={4}>
          <Button variant="contained" startIcon={<IconLoader IconClass={AddIcon} />} component={RouterLink} to='/broker/add'>
            Добавить
          </Button>
        </Box>
      </Container>
    </>
  )
}
