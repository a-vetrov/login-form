import type React from 'react'
import type { CatalogCategoryName } from '../catalog/utils/category-list'
import { StockDetails } from './stock-details'
import { BondsDetails } from './bonds-details'
import { CurrencyDetails } from './currency-details'

export interface DetailsProps {
  isin: string
  ticker: string
}

export const getDetailsCardClass = (category: CatalogCategoryName | undefined): React.FC<DetailsProps> | null => {
  switch (category) {
    case 'stocks': return StockDetails
    case 'bonds': return BondsDetails
    case 'currency': return CurrencyDetails
    default: return null
  }
}
