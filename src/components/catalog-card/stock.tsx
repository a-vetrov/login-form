import React, { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { rubSign } from '../../constants'
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import { getColor, getIsinString } from './utils'

interface Props {
  data: {
    name: string
    isin?: string
    ticker?: string
    moex?: {
      LAST?: number
      LASTTOPREVPRICE?: number
    }
  }
  category: string
}

export const StockCatalogCard: React.FC<Props> = ({ data, category }) => {
  const { name, moex, isin, ticker } = data

  const price = useMemo(() => {
    if (moex?.LAST != undefined) {
      return `${moex.LAST.toLocaleString('ru-RU')} ${rubSign}`
    }
    return '-'
  }, [moex])

  const percent = useMemo(() => {
    if (moex?.LASTTOPREVPRICE != undefined) {
      return `${moex.LASTTOPREVPRICE.toLocaleString('ru-RU')} %`
    }
    return null
  }, [moex])

  const percentColor = useMemo(() => getColor(moex?.LASTTOPREVPRICE), [moex?.LASTTOPREVPRICE])

  const isinString = useMemo(() => getIsinString(data), [data])

  const action = useMemo(() => isin || ticker
    ? {
        component: RouterLink,
        to: `/catalog/${category}/${isin || ticker}`
      }
    : {}
  , [isin, ticker, category])

  return (
    <Card>
      <CardActionArea {...action}>
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent='space-between'>
            <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
              <AnalyticsOutlinedIcon />
            </Avatar>
            <Stack spacing={0} flexGrow={1}>
              <Typography variant='subtitle1'>{name}</Typography>
              <Typography variant='body2' color='text.secondary'>{isinString}</Typography>
            </Stack>
            <Stack spacing={0} alignItems='flex-end' minWidth='100px'>
              <Typography variant='subtitle1'>{price}</Typography>
              <Typography variant='body2' color={percentColor}>{percent}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
