import {CatalogCategoryName} from "../../pages/catalog/utils/category-list.ts";
import {BondCatalogCard} from "./bond.tsx";
import {StockCatalogCard} from "./stock.tsx";

export const getCardClassByCategory = (category: CatalogCategoryName) => {
  switch (category) {
    case 'bonds': return BondCatalogCard
    case 'stocks': return StockCatalogCard
    default: return StockCatalogCard
  }
}
