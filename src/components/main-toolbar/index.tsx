import React from 'react'
import { AppBar, Box, Button, Container, IconButton, MenuItem, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import IconLoader from '../icon-loader'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userInfoSelector } from '../../store/selectors/user-info.ts'
import AccountCircle from '@mui/icons-material/AccountCircle'

export const MainToolbar: React.FC = () => {
  const userInfo = useSelector(userInfoSelector)

  const isAuth = userInfo !== null

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              ml: '-18px',
              px: 0
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <IconLoader IconClass={MenuIcon} />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Vizify
            </Typography>
            {isAuth && (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem sx={{ py: '6px', px: '12px' }} component={ Link } to='/broker/list'>
                  <Typography variant="body2">
                    Брокеры
                  </Typography>
                </MenuItem>
              </Box>
            )}
            {isAuth
              ? (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <IconLoader IconClass={AccountCircle} />
              </IconButton>
                )
              : (
              <Button color="inherit" component={Link} to='/login'>Войти</Button>
                )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
