import { createSelector } from '@reduxjs/toolkit'
import { catalogApi } from '../../services/catalog'

const stocksCatalogSelector = catalogApi.endpoints.getStocks.select()

export const getStockByIsin = (isin: string) => createSelector(
  (state) => stocksCatalogSelector(state),
  ({ data }) => {
    console.log('isin', isin)
    console.log(data?.instruments)
    return data?.instruments.find((item) => item.isin === isin)
  }
)
