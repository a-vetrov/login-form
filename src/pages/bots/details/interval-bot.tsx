import React, { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { type BotsListDataType } from '../../../services/bots'
import { StopBotButton } from './stop-button'
import { CandleStickChart } from '../../../components/candle-stick-chart/candle-stick-chart'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

interface Props {
  data: BotsListDataType
}

interface IntervalBotData {
  product: {
    isin: string
    figi: string
    uid: string
    name: string
    type: string
  }
  amountPerStep: number
  bounds: {
    min: number
    max: number
  }
  stepsCount?: number
  selectedAccount: string
}

export const IntervalBotDetails: React.FC<Props> = ({ data }) => {
  const { id, active, properties } = data

  const { product, stepsCount, bounds } = properties as unknown as IntervalBotData

  const activeLabel = useMemo(() => {
    if (active) {
      return <Typography variant='subtitle1' color='success.main'>Активен</Typography>
    } else {
      return <Typography variant='subtitle1' color='error.light'>Остановлен</Typography>
    }
  }, [active])

  return (
    <>
      <Typography variant="h1" marginBottom={1}>
        Интервальный бот
      </Typography>
      {activeLabel}
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">Продукт</TableCell>
              <TableCell align="right">{product.name}</TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">Верхняя граница</TableCell>
              <TableCell align="right">{bounds.max}</TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">Нижняя граница</TableCell>
              <TableCell align="right">{bounds.min}</TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">Количество шагов</TableCell>
              <TableCell align="right">{stepsCount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box marginY={2}>
        <CandleStickChart
          instrumentId={product.uid}
          lowBoundary={bounds.min}
          highBoundary={bounds.max}
          stepsCount={stepsCount}
        />
      </Box>
      {active && <StopBotButton id={id}/>}
    </>
  )
}
