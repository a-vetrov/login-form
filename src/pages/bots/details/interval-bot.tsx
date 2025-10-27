import React, { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { type BotsListDataType } from '../../../services/bots'
import { StopBotButton } from './stop-button'
import { CandleStickChart } from '../../../components/candle-stick-chart/candle-stick-chart'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import { IntervalDetails } from '../interval-bot/interval-details'
import { BlueTable } from '../../../components/blue-table'
import { fromNumberToMoneyString } from '../../../utils/money'
import { getInstrumentName } from '../../../utils/product'
import { getBotOrders } from '../../../store/selectors/orders'
import { useSelector } from 'react-redux'
import { CandleStickChartTradingView } from '../../../components/candle-stick-chart/candle-stick-chart-trading-view'

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
  stepProfit?: number
  selectedAccount: string
}

export const IntervalBotDetails: React.FC<Props> = ({ data }) => {
  const { id, active, properties, steps } = data

  const { product, stepsCount, bounds, stepProfit, amountPerStep } = properties as unknown as IntervalBotData

  const activeLabel = useMemo(() => {
    if (active) {
      return <Typography variant='subtitle1' color='success.main'>Активен</Typography>
    } else {
      return <Typography variant='subtitle1' color='error.light'>Остановлен</Typography>
    }
  }, [active])

  const orders = useSelector(getBotOrders(id))

  return (
    <>
      <Typography variant="h1" marginBottom={1}>
        Интервальный бот
      </Typography>
      {activeLabel}
        <Table>
          <TableBody>
            <BlueTable.Row sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <BlueTable.Cell component="th" scope="row">Продукт</BlueTable.Cell>
              <BlueTable.Cell align="right">{getInstrumentName(product)}</BlueTable.Cell>
            </BlueTable.Row>
            <BlueTable.Row sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <BlueTable.Cell component="th" scope="row">Верхняя граница</BlueTable.Cell>
              <BlueTable.Cell align="right">{fromNumberToMoneyString(bounds.max, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
            <BlueTable.Row sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <BlueTable.Cell component="th" scope="row">Нижняя граница</BlueTable.Cell>
              <BlueTable.Cell align="right">{fromNumberToMoneyString(bounds.min, 'RUB')}</BlueTable.Cell>
            </BlueTable.Row>
            <BlueTable.Row sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <BlueTable.Cell component="th" scope="row">Количество шагов</BlueTable.Cell>
              <BlueTable.Cell align="right">{stepsCount}</BlueTable.Cell>
            </BlueTable.Row>
            <BlueTable.Row sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <BlueTable.Cell component="th" scope="row">Количество лотов в шаге сетки</BlueTable.Cell>
              <BlueTable.Cell align="right">{amountPerStep}</BlueTable.Cell>
            </BlueTable.Row>
            <BlueTable.Row sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <BlueTable.Cell component="th" scope="row">Профит одного шага</BlueTable.Cell>
              <BlueTable.Cell align="right">{stepProfit}</BlueTable.Cell>
            </BlueTable.Row>
          </TableBody>
        </Table>
      <Box marginY={2}>
        <CandleStickChartTradingView instrumentId={product.uid} steps={steps} orders={orders} key={id} />
      </Box>
      <Box marginY={2}>
        <CandleStickChart instrumentId={product.uid} steps={steps} orders={orders} />
      </Box>
      <IntervalDetails id={id} active={active} />
      {active && <StopBotButton id={id}/>}
    </>
  )
}
