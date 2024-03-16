import React, { useCallback, useEffect, useMemo } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { MainToolbar } from '../../components/main-toolbar'
import { Alert, AlertTitle, Box, Button, Container, TextField, Typography } from '@mui/material'
import { type TokenDataType, useAddBrokerTokenMutation } from '../../services/broker.ts'

export const BrokerAddPage: React.FC = () => {
  const [postData, { isLoading, error, isSuccess }] = useAddBrokerTokenMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      navigate('/broker/list')
    }
  }, [isSuccess])

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

  const alert = useMemo(() => {
    if (error) {
      const { title, message } = error.data?.error

      return (
        <Box marginTop={2}>
          <Alert severity="warning">
            {title && <AlertTitle>{error.data.error.title}</AlertTitle>}
            {message ?? 'Не удалось добавить токен'}
          </Alert>
        </Box>
      )
    }
    return null
  }, [error])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Добавить токен брокера
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} noValidate>
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
          {alert}
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
