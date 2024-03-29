import React from 'react'
import {
  Avatar,
  Box,
  Container,
  Grid, Link,
  TextField,
  Typography,
  Button,
  Alert, AlertTitle
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import IconLoader from '../../components/icon-loader'
import { useRegisterUserMutation } from '../../services/register'

export const RegisterPage: React.FC = () => {
  const [trigger, data] = useRegisterUserMutation()

  const { isLoading, error } = data

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    void trigger(data)
  }

  return (
      <Container component="main" maxWidth="xs">
          <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
          >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <IconLoader IconClass={LockOutlinedIcon} />
              </Avatar>
              <Typography component="h1" variant="h5">
                  Зарегистрироваться
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              autoComplete="given-name"
                              name="firstName"
                              required
                              fullWidth
                              id="firstName"
                              label="Имя"
                              autoFocus
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              required
                              fullWidth
                              id="lastName"
                              label="Фамилия"
                              name="lastName"
                              autoComplete="family-name"
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              required
                              fullWidth
                              id="email"
                              label="E-mail"
                              name="email"
                              autoComplete="email"
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              required
                              fullWidth
                              name="password"
                              label="Пароль"
                              type="password"
                              id="password"
                              autoComplete="new-password"
                          />
                      </Grid>
                  </Grid>
                {
                  (error != null) && (
                    <Box marginTop={2}>
                      <Alert severity="warning">
                        <AlertTitle>{error.data.error.title}</AlertTitle>
                        {error.data.error.message}
                      </Alert>
                    </Box>
                  )
                }
                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={isLoading}
                  >
                      Зарегистрироваться
                  </Button>
                  <Grid container justifyContent="flex-end">
                      <Grid item>
                          <Link href="./login" variant="body2">
                              Уже есть аккаунт? Войдите
                          </Link>
                      </Grid>
                  </Grid>
              </Box>
          </Box>
      </Container>
  )
}
