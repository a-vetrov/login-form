import React from 'react'
import { type PortfolioPosition } from '../../types/tinkoff/operations.ts'
import { Stack, Typography } from '@mui/material'
import RequestPageOutlinedIcon from '@mui/icons-material/RequestPageOutlined'

interface Props {
  data: PortfolioPosition
}

export const ProductCard: React.FC<Props> = ({ data }) => {
  const title = data.figi
  return (
    <Stack direction="row" spacing={2}>
      <RequestPageOutlinedIcon />
      <Typography variant='subtitle1'>{title}</Typography>
      <Typography variant='subtitle1'>{data.currentPrice?.units}</Typography>
    </Stack>
  )
}
