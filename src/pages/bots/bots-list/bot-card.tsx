import React, { useMemo } from 'react'
import { type BotsListDataType } from '../../../services/bots'
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import { ViewDayOutlined } from '@mui/icons-material'
import { AccountTypes, BotsType, dotDelimiter } from '../../../constants'
import { Link } from 'react-router-dom'
import { fromNumberToMoneyString } from '../../../utils/money'
import { format } from 'date-fns'

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

  const activeLabel = useMemo(() => {
    if (data.active) {
      return <Typography variant='subtitle1' color='success.main'>Активен</Typography>
    } else {
      return <Typography variant='subtitle1' color='error.light'>Остановлен</Typography>
    }
  }, [data.active])

  const details = useMemo(() => {
    const result = []
    if (data.accountType === AccountTypes.sandbox) {
      result.push('Песочница')
    }

    const { product, bounds } = data.properties

    if (product?.name) {
      result.push(product.name)
    } else if (product?.isin) {
      result.push(product.isin)
    }

    if (bounds) {
      result.push(`${fromNumberToMoneyString(bounds.min, 'RUB')}⇔${fromNumberToMoneyString(bounds.max, 'RUB')}`)
    }

    return result.join(dotDelimiter)
  }, [data])

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
              <Typography variant='body2' color='text.secondary'>{details}</Typography>
            </Stack>
            <Stack spacing={0} alignItems='flex-end'>
              {activeLabel}
              <Typography variant='body2'>Создан: {format(data.created, 'dd.MM.yyyy HH:mm')}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
