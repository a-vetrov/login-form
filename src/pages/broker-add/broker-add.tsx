import React, { useCallback } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { MainToolbar } from '../../components/main-toolbar'
import { Box, Button, Container, TextField } from '@mui/material'
import { type TokenDataType, useAddBrokerTokenMutation } from '../../services/broker.ts'

export const BrokerAddPage: React.FC = () => {
  const [postData, { isLoading, error, isSuccess }] = useAddBrokerTokenMutation()

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = {
      name: formData.get('name'),
      token: formData.get('token')
    }

    if (result.name !== null && result.token !== null) {
      void postData(result as TokenDataType)
    }
  }, [])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="xs">
        <h1>Добавить токен брокера</h1>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Имя токена"
            name="name"
            autoComplete="Тинькофф"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="token"
            label="Токен"
            name="token"
            multiline
            rows={4}
          />
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            Добавить
          </Button>
          <Button variant="outlined" component={RouterLink} to='/broker/list' fullWidth disabled={isLoading}>
            Отмена
          </Button>
        </Box>

      </Container>
    </>
  )
}
