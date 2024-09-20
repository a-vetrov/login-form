import React, { useEffect, useRef } from 'react'
import * as Plot from '@observablehq/plot'
import { marketDataApi } from '../../services/market-data'

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
    const plot = Plot.plot({
      y: { grid: true },
      color: { scheme: 'burd' },
      marks: [
        Plot.ruleY([0]),
        Plot.dot(data.candles, { x: 'time', y: 'volume'})
      ]
    })
    containerRef.current.append(plot)
    return () => { plot.remove() }
  }, [data])

  return (
    <div>
      CandleStickChart {instrumentId}
      <div ref={containerRef}/>
    </div>
  )
}
