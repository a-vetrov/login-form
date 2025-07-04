import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { HistoricCandle } from '../../types/tinkoff/marketdata.ts'
import type { IntervalBotStepParams, OrderDataType } from '../../services/bots.ts'
import { marketDataApi } from '../../services/market-data.ts'
import { getFromMoneyValue } from '../../utils/money.ts'
import { CircularProgress } from '@mui/material'
import { ErrorAlert } from '../error-alert/error-alert.tsx'
import {
  CandlestickSeries,
  createChart,
  ColorType,
  type ISeriesApi,
  type Time,
  createSeriesMarkers, type ISeriesMarkersPluginApi
} from 'lightweight-charts'
import { getPriceMultiplier } from './utils.ts'

interface Props {
  instrumentId: string
  onChange?: (candles: HistoricCandle[]) => void
  steps?: IntervalBotStepParams[]
  orders?: OrderDataType[]
}

export const CandleStickChartTradingView: React.FC<Props> = ({ instrumentId, steps, orders }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading, error } = marketDataApi.useGetCandlesQuery({ instrumentId, interval: 3 }, { pollingInterval: 5000 })

  const [series, setSeries] = useState<ISeriesApi<'Candlestick', Time>>()
  const [seriesMarkers, setSeriesMarkers] = useState<ISeriesMarkersPluginApi<number>>()

  useLayoutEffect(() => {
    if (!containerRef.current || series) {
      return
    }
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'white'
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' }
      },
      height: 400,
      autoSize: true,
      localization: {
        timeFormatter: (time) => {
          // Custom time formatting logic here
          return new Date(time * 1000).toLocaleTimeString()
        }
      }
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

    try {
      if (series.data().length === 0) {
        series.setData(plotData)
      } else {
        const oldData = series.data()
        let shiftIndex = 0

        oldData.find((item, index) => {
          if (item.time === plotData[0].time) {
            shiftIndex = index
            return true
          }
          return false
        })

        series.update(plotData[plotData.length - 1 - shiftIndex], true)

        if (shiftIndex > 0) {
          for (let i = shiftIndex; i > 0; i--) {
            series.update(plotData[plotData.length - i], false)
          }
        }
      }
    } catch (e: Error) {
      console.log(e)
    }
  }, [data, series])

  useEffect(() => {
    if (!steps?.length || !series) {
      return
    }

    series.priceLines().forEach((priceLine) => {
      series.removePriceLine(priceLine)
    })

    steps.forEach((step, index) => {
      const priceLine = {
        price: step.min,
        color: '#FFFF0066',
        lineWidth: 1,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: false,
        title: ''
      }

      if (index === 0) {
        priceLine.axisLabelVisible = true
        priceLine.title = 'min'
      } else if (index === steps.length - 1) {
        priceLine.axisLabelVisible = true
        priceLine.title = 'max'
      }

      series.createPriceLine(priceLine)
    })
  }, [series !== undefined, steps])

  useEffect(() => {
    if (!orders?.length || !series) {
      return
    }

    const markers = orders.map(({ executionDate, averagePositionPrice, direction, product }) => (
      {
        time: new Date(executionDate).getTime() / 1000,
        position: direction === 1 ? 'belowBar' : 'aboveBar',
        color: direction === 1 ? '#00FF00' : '#FF0000',
        shape: direction === 1 ? 'arrowUp' : 'arrowDown'
      }))

    if (seriesMarkers) {
      seriesMarkers.setMarkers(markers)
    } else {
      setSeriesMarkers(createSeriesMarkers(series, markers))
    }
  }, [series !== undefined, orders, seriesMarkers])

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
