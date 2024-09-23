import React, { useEffect, useRef } from 'react'
import * as Plot from '@observablehq/plot'
import { marketDataApi } from '../../services/market-data'
import { getFromMoneyValue } from '../../utils/money'

interface Props {
  instrumentId: string
}

/**
 * https://apexcharts.com/react-chart-demos/candlestick-charts/basic/
 * https://apexcharts.com/docs/react-charts/
 * https://observablehq.com/@d3/candlestick-chart/2
 * @constructor
 */

export const CandleStickChart: React.FC<Props> = ({ instrumentId }) => {
  const containerRef = useRef(null)
  const { data } = marketDataApi.useGetCandlesQuery({ instrumentId })

  useEffect(() => {
    if (!data) return
    const plotData = data.candles.map((item) => {
      return {
        time: new Date(item.time),
        close: getFromMoneyValue(item.close),
        open: getFromMoneyValue(item.open),
        low: getFromMoneyValue(item.low),
        high: getFromMoneyValue(item.high)
      }
    })

    const plot = Plot.plot({
      inset: 6,
      width: 928,
      grid: true,
      color: { domain: [-1, 0, 1], range: ['#e41a1c', '#000000', '#4daf4a'] },
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
        })
      ]
    })
    containerRef.current?.append(plot)
    return () => { plot.remove() }
  }, [data])

  return (
    <div>
      CandleStickChart {instrumentId}
      <div ref={containerRef}/>
    </div>
  )
}
