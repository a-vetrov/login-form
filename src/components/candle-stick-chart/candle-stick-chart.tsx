import React, { useEffect, useRef, useState } from 'react'
import * as Plot from '@observablehq/plot'
import { marketDataApi } from '../../services/market-data'
import { getFromMoneyValue } from '../../utils/money'
import { CandleIntervalBar } from './interval-bar'
import type { HistoricCandle } from '../../types/tinkoff/marketdata'
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material'
import { ErrorAlert } from '../error-alert/error-alert'
import { type IntervalBotStepParams, type OrderDataType } from '../../services/bots'
import { getPriceMultiplier } from './utils'

interface Props {
  instrumentId: string
  onChange?: (candles: HistoricCandle[]) => void
  steps?: IntervalBotStepParams[]
  orders?: OrderDataType[]
}

/**
 * https://apexcharts.com/react-chart-demos/candlestick-charts/basic/
 * https://apexcharts.com/docs/react-charts/
 * https://observablehq.com/@d3/candlestick-chart/2
 * https://observablehq.com/plot/marks/rule
 * @constructor
 */

export const CandleStickChart: React.FC<Props> = ({
  instrumentId, onChange, steps, orders
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [interval, setInterval] = useState(3)
  const { data, isLoading, error } = marketDataApi.useGetCandlesQuery({ instrumentId, interval }, { pollingInterval: 30000 })

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (!data) return

    const bounds = []

    if (steps) {
      const stepsData = steps.map(({ min }) => min)
      bounds.push(Plot.ruleY(stepsData, { stroke: '#FFFF00', strokeDasharray: '3 5' }))
    }

    if (orders?.length) {
      try {
        const arr = orders.map(({ executionDate, averagePositionPrice, direction, product }) => (
          {
            x: new Date(executionDate),
            y: averagePositionPrice * getPriceMultiplier(product),
            fill: direction === 1 ? '#00FF00' : '#FF0000',
            rotate: direction === 1 ? 0 : 180
          }))
        bounds.push(Plot.dot(arr, { x: 'x', y: 'y', fill: 'fill', symbol: 'triangle', rotate: 'rotate', stroke: 'none', r: 4 }))
      } catch (e) {}
    }

    const plotData = data.candles.map((item) => {
      return {
        // TODO: convert UTC to Moscow timezone
        time: new Date(item.time),
        close: getFromMoneyValue(item.close),
        open: getFromMoneyValue(item.open),
        low: getFromMoneyValue(item.low),
        high: getFromMoneyValue(item.high)
      }
    })

    const plot = Plot.plot({
      inset: 6,
      width: isSmallScreen ? 600 : 1200,
      height: isSmallScreen ? 400 : 600,
      grid: true,
      color: { domain: [-1, 0, 1], range: ['#e41a1c', '#ffffff', '#4daf4a'] },
      marks: [
        Plot.ruleX(plotData, {
          x: 'time',
          y1: 'low',
          y2: 'high'
        }),
        Plot.ruleX(plotData, {
          x: 'time',
          y1: 'open',
          y2: 'close',
          stroke: (d) => Math.sign(d.close - d.open),
          strokeWidth: 4,
          strokeLinecap: 'round'
        }),
        ...bounds
      ]
    })
    containerRef.current?.replaceChildren(plot)
    return () => { plot.remove() }
  }, [data, isSmallScreen, orders, steps])

  useEffect(() => {
    if (onChange && data) {
      onChange(data.candles)
    }
  }, [onChange, data])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <ErrorAlert error={error} />
  }

  return (
    <>
      <CandleIntervalBar interval={interval} onChange={setInterval}/>
      <div ref={containerRef}/>
    </>
  )
}
