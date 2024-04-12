import React, { useCallback, useMemo } from 'react'
import { Box, Divider, Drawer } from '@mui/material'
import { useUserInfo } from '../../utils/hooks/use-user-info'
import { useNavigate } from 'react-router-dom'
import {
  BusinessCenterOutlined,
  ListAltOutlined, LoginOutlined,
  Logout,
  SportsEsportsOutlined, TokenOutlined
} from '@mui/icons-material'
import { MenuItemLink } from './menu-item'
import { loginApi } from '../../services/login'
import { userInfoSlice } from '../../store/slices/user-slice'
import { useDispatch } from 'react-redux'

interface Props {
  open: boolean
  onClose: () => void
}

export const MenuDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { isLoading, isAuth } = useUserInfo()
  const [trigger] = loginApi.useLogoutUserMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = useCallback(async () => {
    await trigger()
    dispatch(userInfoSlice.actions.logout())
    onClose()
    navigate('/')
  }, [trigger])

  const itemsList = useMemo(() => {
    if (isAuth) {
      return (
        <>
          <MenuItemLink title='Портфель' link='/portfolio' Icon={BusinessCenterOutlined} />
          <MenuItemLink title='Каталог' link='/catalog' Icon={ListAltOutlined} />
          <MenuItemLink title='Акции' link='/catalog/stocks' shifted />
          <MenuItemLink title='Облигации' link='/catalog/bonds' shifted />
          <MenuItemLink title='Валюта' link='/catalog/currency' shifted />
          <MenuItemLink title='Песочница' link='/sandbox' Icon={SportsEsportsOutlined} />
          <MenuItemLink title='Брокеры' link='/broker/list' Icon={TokenOutlined} />

          <Divider />
          <MenuItemLink title='Выйти' Icon={Logout} onClick={handleLogout}/>
        </>
      )
    }

    return (
      <>
        <MenuItemLink title='Войти' Icon={LoginOutlined} link='/login'/>
      </>
    )
  }, [isAuth])

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          minWidth: '60dvw',
          p: 2,
          backgroundColor: 'background.paper',
          flexGrow: 1
        }}
      >
        {itemsList}
      </Box>
    </Drawer>
  )
}
