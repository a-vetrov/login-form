import React, { useCallback, useMemo } from 'react'
import { type GetCatalogResponseType } from '../../services/catalog'
import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'

const DELIMITER = ' • '

interface Props {
  data: GetCatalogResponseType
  onClick: (item: GetCatalogResponseType) => void
}

export const CatalogCard: React.FC<Props> = ({ data, onClick }) => {
  const { name, isin, ticker, figi } = data

  const details = useMemo(() => {
    const arr = []
    if (isin) {
      arr.push(isin)
    }
    if (ticker) {
      arr.push(ticker)
    }
    if (figi) {
      arr.push(figi)
    }
    return arr.join(DELIMITER)
  }, [figi, isin, ticker])

  const handleClick = useCallback(() => {
    onClick(data)
  }, [data, onClick])

  return (
    <Card onClick={handleClick}>
      <CardActionArea>
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent='space-between'>
            <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
              <AnalyticsOutlinedIcon />
            </Avatar>
            <Stack spacing={0} flexGrow={1}>
              <Typography variant='subtitle1'>{name}</Typography>
              <Typography variant='body2'>{details}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
