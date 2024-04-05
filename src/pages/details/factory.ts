import type React from 'react'
import type { CatalogCategoryName } from '../catalog/utils/category-list'
import { StockDetails } from './stock-details'

export interface DetailsProps {
  isin: string
}

export const getDetailsCardClass = (category: CatalogCategoryName | undefined): React.FC<DetailsProps> | null => {
  switch (category) {
    case 'stocks': return StockDetails
    case 'bonds':
    default: return null
  }
}
