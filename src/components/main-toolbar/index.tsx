import React, { useCallback, useMemo, useState } from 'react'
import { AppBar, Box, Button, Container, IconButton, MenuItem, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import IconLoader from '../icon-loader'
import { Link } from 'react-router-dom'
import { useUserInfo } from '../../utils/hooks/use-user-info'
import { MenuDrawer } from './menu-drawer'
import { UserDrawer } from './user-drawer'

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
        <UserDrawer />
        )
      : (
        <Button color="inherit" component={Link} to='/login'>Войти</Button>
        )
  }, [isLoading, isAuth])

  return (
    <AppBar position="static"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              boxShadow: 'none',
              backgroundImage: 'none',
              borderColor: 'divider'
            }}>
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
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component={ Link } to='/' sx={{ color: 'white', textDecoration: 'none' }}>
                  Vizify
                </Typography>
            </Box>
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
