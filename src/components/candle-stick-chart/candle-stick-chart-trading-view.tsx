import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { HistoricCandle } from '../../types/tinkoff/marketdata.ts'
import type { IntervalBotStepParams, OrderDataType } from '../../services/bots.ts'
import { marketDataApi } from '../../services/market-data.ts'
import { Box, CircularProgress } from '@mui/material'
import { ErrorAlert } from '../error-alert/error-alert.tsx'
import { OrderTooltip } from './order-tooltip.tsx'
import { CandleIntervalBar } from './interval-bar.tsx'
import { CandleStickChart } from './candle-stick.ts'
import { type SeriesDataItemTypeMap, type Time } from 'lightweight-charts'
import { prepareCandlesData } from './utils.ts'

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

export const CandleStickChartTradingView: React.FC<Props> = ({ instrumentId, steps, orders, onChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [interval, setInterval] = useState(3)
  const [isChartEmpty, setIsChartEmpty] = useState(true)

  const { data, isFetching, error } = marketDataApi.useGetCandlesQuery({ instrumentId, interval }, { pollingInterval: 10000 })
  const [loadTrigger, additionalData] = marketDataApi.useGetCandlesToMutation()

  const chart = useRef<CandleStickChart>()
  const [tooltip, setTooltip] = useState<TooltipData | undefined>()

  const isLoading = additionalData.isLoading || (isFetching && isChartEmpty)

  const loadAdditionalData = useCallback((to: Time): void => {
    if (chart.current instanceof CandleStickChart && !chart.current.isLoadingAdditionalData) {
      chart.current.isLoadingAdditionalData = true
      void loadTrigger({
        instrumentId,
        interval,
        to: to * 1000
      })
    }
  }, [instrumentId, interval, loadTrigger])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    if (!chart.current) {
      chart.current = new CandleStickChart(containerRef.current)
      chart.current.updateTooltip = setTooltip
      chart.current.handleMinBounds = loadAdditionalData

      if (steps?.length) {
        (chart.current).setSteps(steps)
      }
    }

    if (data && chart.current instanceof CandleStickChart) {
      const plotData = prepareCandlesData(data) as Array<SeriesDataItemTypeMap<Time>['Candlestick']>
      chart.current.updateData(plotData)
      setIsChartEmpty(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- Шаги обновляем другим хуком
  }, [data])

  useEffect(() => {
    if (chart.current instanceof CandleStickChart) {
      chart.current.handleMinBounds = loadAdditionalData
    }
  }, [loadAdditionalData])

  useEffect(() => {
    if (!(chart.current instanceof CandleStickChart)) {
      return
    }

    if (additionalData.data ?? additionalData.isError) {
      chart.current.isLoadingAdditionalData = false
    }

    if (additionalData.data) {
      chart.current.updateData(prepareCandlesData(additionalData.data) as Array<SeriesDataItemTypeMap<Time>['Candlestick']>)
    }
  }, [additionalData.data, additionalData.isError])

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

  useEffect(() => {
    if (onChange && chart.current instanceof CandleStickChart) {
      const data = chart.current.data
      if (data?.length) {
        onChange(data)
      }
    }
  }, [onChange, data, additionalData.data])

  const handleIntervalChange = useCallback((newValue: number) => {
    // Стираем предыдущие данные, если интервал изменился
    chart.current?.clearData()
    setIsChartEmpty(true)
    setInterval(newValue)
  }, [])

  return (
    <Box sx={{ position: 'relative' }}>
      <CandleIntervalBar interval={interval} onChange={handleIntervalChange}/>
      <div ref={containerRef}/>
      <OrderTooltip orders={orders} {...tooltip}/>
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 200 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <ErrorAlert error={error} />}
    </Box>
  )
}
