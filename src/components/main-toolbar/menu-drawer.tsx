import React, { useMemo } from 'react'
import { Box, Button, Divider, Drawer, MenuItem, Typography } from '@mui/material'
import { useUserInfo } from '../../utils/hooks/use-user-info'
import { Link } from 'react-router-dom'
import {
  BusinessCenterOutlined,
  ListAltOutlined,
  Logout,
  SportsEsportsOutlined
} from '@mui/icons-material'
import { MenuItemLink } from './menu-item'

interface Props {
  open: boolean
  onClose: () => void
}

export const MenuDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { isLoading, isAuth } = useUserInfo()

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
          <MenuItemLink title='Брокеры' link='/broker/list' Icon={SportsEsportsOutlined} />

          <Divider />
          <MenuItemLink title='Выйти' link='/logout' Icon={Logout} />
        </>
      )
    }

    return (
      <>
        <Typography variant="body1">
          Для начала работы войдите или зарегистрируйтесь.
        </Typography>
        <MenuItem>
          <Button
            color="primary"
            variant="outlined"
            component={Link} to='/login'
            target="_blank"
            sx={{ width: '100%' }}
          >
            Войти
          </Button>
        </MenuItem>
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
