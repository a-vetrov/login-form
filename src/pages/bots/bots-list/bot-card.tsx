import React, { useMemo } from 'react'
import { type BotsListDataType } from '../../../services/bots'
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import { ViewDayOutlined } from '@mui/icons-material'
import { BotsType } from '../../../constants'
import { Link } from 'react-router-dom'

interface Props {
  data: BotsListDataType
}

export const BotListCard: React.FC<Props> = ({ data }) => {
  const title = useMemo(() => {
    switch (data.type) {
      case BotsType.interval: return 'Интервальный бот'

      default: return `Бот ${data.type}`
    }
  }, [data.type])

  return (
    <Card >
      <CardActionArea component={Link} to={data.id} >
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent='space-between'>
            <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
              <ViewDayOutlined />
            </Avatar>
            <Stack spacing={0} flexGrow={1}>
              <Typography variant='subtitle1'>{title}</Typography>
              <Typography variant='body2'>{data.id}</Typography>
            </Stack>
            <Stack spacing={0} alignItems='flex-end'>
              <Typography variant='subtitle1' color='success.main'>Активен</Typography>
              <Typography variant='body2'>Создан: {data.created}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
