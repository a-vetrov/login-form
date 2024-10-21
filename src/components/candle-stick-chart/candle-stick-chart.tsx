import React, { useEffect, useRef, useState } from 'react'
import * as Plot from '@observablehq/plot'
import { marketDataApi } from '../../services/market-data'
import { getFromMoneyValue } from '../../utils/money'
import { CandleIntervalBar } from './interval-bar'
import type { HistoricCandle } from '../../types/tinkoff/marketdata'
import { useMediaQuery, useTheme } from '@mui/material'

interface Props {
  instrumentId: string
  onChange?: (candles: HistoricCandle[]) => void
  lowBoundary?: number
  highBoundary?: number
  stepsCount?: number
}

/**
 * https://apexcharts.com/react-chart-demos/candlestick-charts/basic/
 * https://apexcharts.com/docs/react-charts/
 * https://observablehq.com/@d3/candlestick-chart/2
 * https://observablehq.com/plot/marks/rule
 * @constructor
 */

export const CandleStickChart: React.FC<Props> = ({
  instrumentId, onChange, lowBoundary,
  highBoundary, stepsCount
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [interval, setInterval] = useState(3)
  const { data } = marketDataApi.useGetCandlesQuery({ instrumentId, interval }, { pollingInterval: 10000 })

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (!data) return

    const bounds = []
    if (stepsCount !== undefined && stepsCount > 1 && lowBoundary !== undefined && highBoundary !== undefined && lowBoundary !== highBoundary) {
      const stepSize = (highBoundary - lowBoundary) / (stepsCount - 1)
      const stepsData = []
      for (let i = lowBoundary; i <= highBoundary; i += stepSize) {
        stepsData.push(i)
      }
      bounds.push(Plot.ruleY(stepsData, { stroke: '#FFFF00', strokeDasharray: '3 5' }))
    } else {
      if (lowBoundary !== undefined) {
        bounds.push(Plot.ruleY([lowBoundary], { stroke: '#0000ff', strokeDasharray: '3 5' }))
      }
      if (highBoundary !== undefined) {
        bounds.push(Plot.ruleY([highBoundary], { stroke: '#0000ff', strokeDasharray: '3 5' }))
      }
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
  }, [data, highBoundary, isSmallScreen, lowBoundary, stepsCount])

  useEffect(() => {
    if (onChange && data) {
      onChange(data.candles)
    }
  }, [onChange, data])

  return (
    <>
      <CandleIntervalBar interval={interval} onChange={setInterval}/>
      <div ref={containerRef}/>
    </>
  )
}
