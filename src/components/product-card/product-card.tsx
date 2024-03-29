import React from 'react'
import { type PortfolioPosition } from '../../types/tinkoff/operations.ts'
import {Avatar, Card, CardActionArea, CardContent, Stack, Typography} from '@mui/material'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import { getProductTotalString } from '../../utils/money.ts'
import { getProductDetails, getProductTotalDetails } from './utils.ts'

interface Props {
  data: PortfolioPosition
}

export const ProductCard: React.FC<Props> = ({ data }) => {
  const title = data.figi
  const total = getProductTotalString(data)
  const details = getProductDetails(data)
  const totalDetails = getProductTotalDetails(data)

  return (
    <Card sx={{ maxWidth: 450 }}>
      <CardActionArea>
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent='space-between'>
            <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
              <AnalyticsOutlinedIcon />
            </Avatar>
            <Stack spacing={0} flexGrow={1}>
              <Typography variant='subtitle1'>{title}</Typography>
              <Typography variant='body2'>{details}</Typography>
            </Stack>
            <Stack spacing={0} alignItems='flex-end'>
              <Typography variant='subtitle1'>{total}</Typography>
              <Typography variant='body2'>{totalDetails}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
