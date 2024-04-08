import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { type DetailsProps } from './factory'
import { catalogApi } from '../../services/catalog'
import { getIds } from './utils'

export const StockDetails: React.FC<DetailsProps> = ({ isin }) => {
  const { data, isLoading } = catalogApi.useGetStocksByIsinQuery(isin)

  const ids = getIds(data)

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <>
      <Typography variant="h2">
        {data.name}
      </Typography>
      {ids && (
        <Typography variant="body1">
          {ids}
        </Typography>
      )}
    </>
  )
}
