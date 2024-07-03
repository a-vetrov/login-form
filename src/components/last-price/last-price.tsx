import React, { useCallback, useMemo } from 'react'
import { marketDataApi } from '../../services/market-data'
import { CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import CachedIcon from '@mui/icons-material/Cached'
import { getLastPrice } from './utils'
import { useDispatch } from 'react-redux'

interface Props {
  uid?: string
}

export const LastPrice: React.FC<Props> = ({ uid }) => {
  const { data, isFetching, error } = marketDataApi.useGetLastPriceQuery(uid as unknown as string, { skip: !uid })

  const dispatch = useDispatch()

  const lastPrice = useMemo(() => {
    return getLastPrice(uid, data)
  }, [data, uid])

  const reloadHandler = useCallback(() => {
    dispatch(marketDataApi.util.invalidateTags(['LastPrice']))
  }, [])

  if (!uid) {
    return null
  }

  if (isFetching) {
    return (
      <Stack flexDirection='row' alignItems='center'>
        <Typography variant="body1">
          {`Последняя цена ${lastPrice ?? '...'}`}
        </Typography>
        <CircularProgress size={20} sx={{ m: 1 }}/>
      </Stack>
    )
  }

  if (error ?? lastPrice === null) {
    return (
      <Stack flexDirection='row' alignItems='center'>
        <Typography variant="body1">
          Ошибка получения последней цены
        </Typography>
        <IconButton aria-label="reload" onClick={reloadHandler}>
          <CachedIcon fontSize="small" />
        </IconButton>
      </Stack>
    )
  }

  return (
    <Stack flexDirection='row' alignItems='center'>
      <Typography variant="body1">
        {`Последняя цена ${lastPrice}`}
      </Typography>
      <IconButton aria-label="reload" onClick={reloadHandler}>
        <CachedIcon fontSize="small" />
      </IconButton>
    </Stack>
  )
}
