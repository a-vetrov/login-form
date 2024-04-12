import React, { useCallback, useMemo, useState } from 'react'
import { AppBar, Box, Button, Container, IconButton, MenuItem, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import IconLoader from '../icon-loader'
import { Link } from 'react-router-dom'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useUserInfo } from '../../utils/hooks/use-user-info'
import { MenuDrawer } from './menu-drawer'

export const MainToolbar: React.FC = () => {
  const { isLoading, isAuth } = useUserInfo()
  const [open, setOpen] = useState(false)

  const togleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

  const closeDrawer = useCallback(() => {
    setOpen(false)
  }, [])

  const userPart = useMemo(() => {
    if (isLoading) {
      return null
    }

    return isAuth
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
        )
  }, [isLoading, isAuth])

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <MenuDrawer open={open} onClose={closeDrawer} />
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
              onClick={togleDrawer}
            >
              <IconLoader IconClass={MenuIcon} />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Vizify
            </Typography>
            {isAuth && (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem sx={{ py: '6px', px: '12px' }} component={ Link } to='/portfolio'>
                  <Typography variant="body2">
                    Портфель
                  </Typography>
                </MenuItem>
                <MenuItem sx={{ py: '6px', px: '12px' }} component={ Link } to='/catalog'>
                  <Typography variant="body2">
                    Каталог
                  </Typography>
                </MenuItem>
                <MenuItem sx={{ py: '6px', px: '12px' }} component={ Link } to='/sandbox'>
                  <Typography variant="body2">
                    Песочница
                  </Typography>
                </MenuItem>
                <MenuItem sx={{ py: '6px', px: '12px' }} component={ Link } to='/broker/list'>
                  <Typography variant="body2">
                    Брокеры
                  </Typography>
                </MenuItem>
              </Box>
            )}
            {userPart}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
