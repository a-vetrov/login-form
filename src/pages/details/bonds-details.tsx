import React, { useMemo } from 'react'
import type { DetailsProps } from './factory'
import { catalogApi } from '../../services/catalog'
import { getIds, getMainProperties } from './utils'
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { ErrorAlert } from '../../components/error-alert/error-alert'

export const BondsDetails: React.FC<DetailsProps> = ({ isin }) => {
  const { data, isLoading, error } = catalogApi.useGetBondsByIsinQuery(isin)

  const ids = useMemo(() => getIds(data), [data])

  const properties = useMemo(() => getMainProperties(data), [data])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <>
      <Typography variant="h2">
        {data?.name || 'Детальная карточка'}
      </Typography>
      {ids && (
        <Typography variant="body1">
          {ids}
        </Typography>
      )}

      <ErrorAlert error={error} />

      {(properties.length > 0) && (
        <TableContainer component={Paper} sx={{ maxWidth: 650, marginY: 2 }}>
          <Table>
            <TableBody>
              {properties.map((item) => (
                <TableRow key={item.key}>
                  <TableCell component="th" scope="row">
                    {item.key}
                  </TableCell>
                  <TableCell align="right">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </>
  )
}
