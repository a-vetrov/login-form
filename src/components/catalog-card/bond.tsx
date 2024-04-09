import React, { useMemo } from 'react'
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { getColor, getIsinString } from './utils'
import { Link as RouterLink } from 'react-router-dom'

interface Props {
  data: {
    name: string
    isin: string
    ticker: string
    maturityDate: string
    moex?: {
      LAST?: number
      LASTTOPREVPRICE?: number
      EFFECTIVEYIELDWAPRICE?: number
    }
  }
}

export const BondCatalogCard: React.FC<Props> = ({ data }) => {
  const { name, maturityDate, moex, isin } = data

  const deadline = useMemo(() => {
    try {
      const date = new Date(maturityDate)
      return format(date, 'dd.MM.yyyy')
    } catch (error) {
      return maturityDate
    }
  }, [maturityDate])

  const toDeadline = useMemo(() => {
    try {
      const date = new Date(maturityDate)
      return formatDistanceToNow(date, { locale: ru })
    } catch (error) {
      return null
    }
  }, [maturityDate])

  const price = useMemo(() => {
    if (moex?.LAST != undefined) {
      return `${moex.LAST.toLocaleString('ru-RU')} %`
    }
    return '-'
  }, [moex])

  const percent = useMemo(() => {
    if (moex?.EFFECTIVEYIELDWAPRICE != undefined) {
      return `${moex.EFFECTIVEYIELDWAPRICE.toLocaleString('ru-RU')} %`
    }
    return null
  }, [moex])

  const percentColor = useMemo(() => getColor(moex?.EFFECTIVEYIELDWAPRICE), [moex?.EFFECTIVEYIELDWAPRICE])

  const isinString = useMemo(() => getIsinString(data), [data])

  const action = useMemo(() => isin
    ? {
        component: RouterLink,
        to: `/catalog/bonds/${isin}`
      }
    : {}
  , [isin])

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
            <Stack spacing={0} alignItems='flex-end' >
              <Typography variant='subtitle1'>{deadline}</Typography>
              <Typography variant='body2'>{toDeadline}</Typography>
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
