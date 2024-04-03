import React, { useMemo } from 'react'
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Props {
  data: {
    name: string
    isin: string
    maturityDate: string
    moex?: {
      PREVPRICE?: number
      YIELDATPREVWAPRICE?: number
    }
  }
}

export const BondCatalogCard: React.FC<Props> = ({ data }) => {
  const { isin, name, maturityDate, moex } = data

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
    if (moex?.PREVPRICE !== undefined) {
      return `${moex.PREVPRICE.toLocaleString('ru-RU')} %`
    }
    return '-'
  }, [moex])

  const percent = useMemo(() => {
    if (moex?.YIELDATPREVWAPRICE !== undefined) {
      return `${moex.YIELDATPREVWAPRICE.toLocaleString('ru-RU')} %`
    }
    return null
  }, [moex])

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent='space-between'>
            <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
              <AnalyticsOutlinedIcon />
            </Avatar>
            <Stack spacing={0} flexGrow={1}>
              <Typography variant='subtitle1'>{name}</Typography>
              <Typography variant='body2'>{isin}</Typography>
            </Stack>
            <Stack spacing={0} alignItems='flex-end' >
              <Typography variant='subtitle1'>{deadline}</Typography>
              <Typography variant='body2'>{toDeadline}</Typography>
            </Stack>
            <Stack spacing={0} alignItems='flex-end' minWidth='100px'>
              <Typography variant='subtitle1'>{price}</Typography>
              <Typography variant='body2'>{percent}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
