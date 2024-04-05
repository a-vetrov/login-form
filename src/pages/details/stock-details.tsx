import React from 'react'
import { Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { getStockByIsin } from '../../store/selectors/catalog-data'
import { type DetailsProps } from './factory'

const widgetScript = {
  __html: `
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js">
  {
  "symbol": "MOEX:SBER",
  "width": 550,
  "locale": "en",
  "colorTheme": "dark",
  "isTransparent": false
}
  </script>
</div>
`
}

export const StockDetails: React.FC<DetailsProps> = ({ isin }) => {
  const data = useSelector(getStockByIsin(isin))

  console.log('Data!!!!', data)

  return (
    <>
      <Typography variant="h2">
        Stock details
      </Typography>
      <div dangerouslySetInnerHTML={widgetScript} />
    </>
  )
}
