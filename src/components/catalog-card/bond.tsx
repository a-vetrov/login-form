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
  }
}

export const BondCatalogCard: React.FC<Props> = ({ data }) => {
  const { isin, name, maturityDate } = data

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
            <Stack spacing={0} alignItems='flex-end'>
              <Typography variant='subtitle1'>{deadline}</Typography>
              <Typography variant='body2'>{toDeadline}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
