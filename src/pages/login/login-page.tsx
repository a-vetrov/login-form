import React, { useEffect } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import IconLoader from '../../components/icon-loader'
import { useLoginUserMutation } from '../../services/login.ts'
import { useDispatch } from 'react-redux'
import { userInfoSlice } from '../../store/slices/user-slice.ts'

export const LoginPage: React.FC = () => {
  const [trigger, { isLoading, error, data }] = useLoginUserMutation()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!error && data?.userInfo) {
      dispatch(userInfoSlice.actions.update(data.userInfo))
      navigate('/')
    }
  }, [error, data])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = {
      email: formData.get('email'),
      password: formData.get('password')
    }
    void trigger(result)
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
              Войти
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  autoFocus
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="current-password"
              />
              {
                (error != null) && (
                  <Box marginTop={2}>
                    <Alert severity="warning">
                      Неправильный логин или пароль
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
                Войти
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Забыли пароль?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" variant="body2" component={RouterLink}>
                    Еще нет аккаунта? Зарегистрируйтесь
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
  )
}
