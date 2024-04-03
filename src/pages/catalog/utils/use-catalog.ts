import { type CatalogCategoryName, categoriesList } from './category-list.ts'
import { useEffect } from 'react'

export const useCatalogApi = (category: CatalogCategoryName) => {
  const apiResults = categoriesList.reduce((accumulator, item) => {
    accumulator[item.name] = item.api()
    return accumulator
  }, {})

  const [trigger, { data, isFetching, error }] = apiResults[category]

  useEffect(() => {
    if (!data && !isFetching) {
      trigger()
    }
  }, [category])

  return { data, isFetching, error }
}
