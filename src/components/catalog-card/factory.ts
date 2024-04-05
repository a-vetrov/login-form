import { type CatalogCategoryName } from '../../pages/catalog/utils/category-list'
import { BondCatalogCard } from './bond'
import { StockCatalogCard } from './stock'

export const getCardClassByCategory = (category: CatalogCategoryName) => {
  switch (category) {
    case 'bonds': return BondCatalogCard
    case 'stocks': return StockCatalogCard
    default: return StockCatalogCard
  }
}
