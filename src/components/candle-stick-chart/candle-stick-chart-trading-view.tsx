import React, { useEffect, useRef, useState } from 'react'
import type { HistoricCandle } from '../../types/tinkoff/marketdata.ts'
import type { IntervalBotStepParams, OrderDataType } from '../../services/bots.ts'
import { marketDataApi } from '../../services/market-data.ts'
import { getFromMoneyValue } from '../../utils/money.ts'
import { Box, CircularProgress } from '@mui/material'
import { ErrorAlert } from '../error-alert/error-alert.tsx'
import { OrderTooltip } from './order-tooltip.tsx'
import { CandleIntervalBar } from './interval-bar.tsx'
import { CandleStickChart } from './candle-stick.ts'

interface Props {
  instrumentId: string
  onChange?: (candles: HistoricCandle[]) => void
  steps?: IntervalBotStepParams[]
  orders?: OrderDataType[]
}

interface TooltipData {
  x: number
  y: number
  orderId: string
}

export const CandleStickChartTradingView: React.FC<Props> = ({ instrumentId, steps, orders }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [interval, setInterval] = useState(3)

  const { data, isLoading, error } = marketDataApi.useGetCandlesQuery({ instrumentId, interval }, { pollingInterval: 5000 })

  const chart = useRef<CandleStickChart>()
  const [tooltip, setTooltip] = useState<TooltipData | undefined>()

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    if (!chart.current) {
      chart.current = new CandleStickChart(containerRef.current)
      chart.current.updateTooltip = setTooltip

      if (steps?.length) {
        (chart.current).setSteps(steps)
      }
    }

    if (chart.current instanceof CandleStickChart) {
      const plotData = data.candles.map((item) => {
        return {
          time: new Date(item.time).getTime() / 1000,
          close: getFromMoneyValue(item.close),
          open: getFromMoneyValue(item.open),
          low: getFromMoneyValue(item.low),
          high: getFromMoneyValue(item.high)
        }
      })
      chart.current.updateData(plotData)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- Шаги обновляем другим хуком
  }, [data])

  // Обновляем интервалы
  useEffect(() => {
    if (steps?.length) {
      chart.current?.setSteps(steps)
    }
  }, [steps])

  // Обновляем ордера
  useEffect(() => {
    if (orders?.length) {
      chart.current?.updateOrders(orders)
    }
  }, [orders, orders?.length])

  // Стираем предыдущие данные, если интервал изменился
  useEffect(() => {
    chart.current?.clearData()
  }, [interval])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <ErrorAlert error={error} />
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <CandleIntervalBar interval={interval} onChange={setInterval}/>
      <div ref={containerRef}/>
      <OrderTooltip orders={orders} {...tooltip}/>
    </Box>
  )
}
