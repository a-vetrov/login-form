import React from 'react'
import { marketDataApi } from '../../services/market-data'

interface Props {
  instrumentId: string
}

/**
 * https://apexcharts.com/react-chart-demos/candlestick-charts/basic/
 * https://apexcharts.com/docs/react-charts/
 * @constructor
 */

export const CandleStickChart: React.FC<Props> = ({ instrumentId }) => {
  const { data } = marketDataApi.useGetCandlesQuery({ instrumentId })

  return (
    <div>
      CandleStickChart {instrumentId}
    </div>
  )
}
