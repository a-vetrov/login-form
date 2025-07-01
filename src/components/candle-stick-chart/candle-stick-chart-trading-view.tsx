import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { HistoricCandle } from '../../types/tinkoff/marketdata.ts'
import type { IntervalBotStepParams, OrderDataType } from '../../services/bots.ts'
import { marketDataApi } from '../../services/market-data.ts'
import { getFromMoneyValue } from '../../utils/money.ts'
import { CircularProgress } from '@mui/material'
import { ErrorAlert } from '../error-alert/error-alert.tsx'
import { CandlestickSeries, createChart, ColorType, type ISeriesApi, type Time } from 'lightweight-charts'

interface Props {
  instrumentId: string
  onChange?: (candles: HistoricCandle[]) => void
  steps?: IntervalBotStepParams[]
  orders?: OrderDataType[]
}

export const CandleStickChartTradingView: React.FC<Props> = ({ instrumentId, interval }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading, error } = marketDataApi.useGetCandlesQuery({ instrumentId, interval }, { pollingInterval: 5000 })

  const [series, setSeries] = useState<ISeriesApi<'Candlestick', Time>>()

  useLayoutEffect(() => {
    if (!containerRef.current || series) {
      return
    }
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black'
      },
      width: (containerRef.current).clientWidth,
      height: 300
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' })
    setSeries(candlestickSeries)
    chart.timeScale().fitContent()
  }, [data, series])

  useEffect(() => {
    if (!data || !series) {
      return
    }

    const plotData = data.candles.map((item) => {
      return {
        // TODO: convert UTC to Moscow timezone
        time: new Date(item.time).getTime() / 1000,
        close: getFromMoneyValue(item.close),
        open: getFromMoneyValue(item.open),
        low: getFromMoneyValue(item.low),
        high: getFromMoneyValue(item.high)
      }
    })

    if (series.data().length === 0) {
      series.setData(plotData)
    } else {
      console.log('update')
      plotData.forEach((item) => {
        console.log('update', item)
        series.update(item, true)
      })
    }
  }, [data, series])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <ErrorAlert error={error} />
  }

  return (
    <>
      <div ref={containerRef}/>
    </>
  )
}
