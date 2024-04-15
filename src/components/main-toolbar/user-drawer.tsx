import React, {useCallback, useState} from 'react';
import {useUserInfo} from '../../utils/hooks/use-user-info';
import {Avatar, Box, Divider, Drawer, IconButton, Stack, Typography} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {loginApi} from '../../services/login';
import {userInfoSlice} from '../../store/slices/user-slice';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Logout} from '@mui/icons-material';
import {MenuItemLink} from './menu-item';

export const UserDrawer: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [trigger] = loginApi.useLogoutUserMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const toggleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

  const closeDrawer = useCallback(() => {
    setOpen(false)
  }, [])

  const { isLoading, userInfo } = useUserInfo()

  const handleLogout = useCallback(async () => {
    await trigger()
    dispatch(userInfoSlice.actions.logout())
    closeDrawer()
    navigate('/')
  }, [trigger])

  console.log('userInfo', userInfo)

  if (!userInfo) {
    return null
  }

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={toggleDrawer}
      >
        <AccountCircle />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <Box
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            flexGrow: 1
          }}
        >
          <Stack alignItems='center'>
          <Avatar>
            <AccountCircle />
          </Avatar>
          </Stack>
          {userInfo.name && (
            <Typography variant='body1' marginTop={4}  align='center'>{userInfo.name}</Typography>
          )}
          {userInfo.email && (
            <Typography variant='body2' marginTop={2} marginBottom={4} align='center'>{userInfo.email}</Typography>
          )}

          <Typography variant='body2' marginTop={2} marginBottom={4} color='text.secondary'>Тут потом будут какие-то<br/>натройки профиля и т.п.</Typography>

          <Divider sx={{marginY: 4}}/>
          <MenuItemLink title='Выйти' Icon={Logout} onClick={handleLogout}/>

        </Box>
      </Drawer>
    </>
  );
};
