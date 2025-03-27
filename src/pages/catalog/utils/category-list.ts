import { catalogApi } from '../../../services/catalog'
import { type UseLazyQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks'

export type CatalogCategoryName = 'stocks' | 'bonds' | 'currency' | 'futures'

interface CatalogCategoryType {
  name: CatalogCategoryName
  title: string
  link: string
  api: UseLazyQuery<any>
}

export const categoriesList: CatalogCategoryType[] = [
  {
    name: 'stocks',
    title: 'Акции',
    link: '/catalog/stocks',
    api: catalogApi.useLazyGetStocksQuery
  },
  /*
  {
    name: 'bonds',
    title: 'Облигации',
    link: '/catalog/bonds',
    api: catalogApi.useLazyGetBondsQuery
  },
  {
    name: 'currency',
    title: 'Валюта',
    link: '/catalog/currency',
    api: catalogApi.useLazyGetCurrenciesQuery
  },

   */
  {
    name: 'futures',
    title: 'Фьючерсы',
    link: '/catalog/futures',
    api: catalogApi.useLazyGetFuturesQuery
  }
]

export const defaultCategory = categoriesList[0].name

export const getCategoryByName = (name: string): CatalogCategoryType | undefined => categoriesList.find((item) => item.name === name)
