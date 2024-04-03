import React, { useCallback, useMemo, useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { CircularProgress, Container, TextField, Typography } from '@mui/material'
import { CategoryToolbar } from './components/category-toolbar.tsx'
import { BondCatalogCard } from '../../components/catalog-card/bond.tsx'
import { useMatch } from 'react-router-dom'
import { type CatalogCategoryName, defaultCategory } from './utils/category-list.ts'
import { useCatalogApi } from './utils/use-catalog.ts'
import {ErrorAlert} from "../../components/error-alert/error-alert.tsx";

export const CatalogPage: React.FC = () => {
  //  const [bondsTrigger, bondsData] = catalogApi.useLazyGetBondsQuery()
  //  const [stocksTrigger, stocksData] = catalogApi.useLazyGetStocksQuery()

  const match = useMatch('/catalog/:category')

  const category = match?.params.category ?? defaultCategory

  const { data, error, isFetching } = useCatalogApi(category as CatalogCategoryName)

  const [filterValue, setFilterValue] = useState('')

  const handleFilterChange = useCallback<React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>((event) => {
    const newValue = event.target.value
    setFilterValue(newValue)
  }, [setFilterValue])

  const items = useMemo(() => {
    if (!data?.instruments) {
      return null
    }
    const filterLowerCase = filterValue.toLowerCase()

    const arr = filterValue
      ? data.instruments.filter((item) => {
        return item.name.toLowerCase().includes(filterLowerCase) ||
          item.isin.toLowerCase().includes(filterLowerCase) ||
          item.ticker?.toLowerCase().includes(filterLowerCase)
      })
      : data.instruments

    return arr.slice(0, 20)
  }, [data, filterValue])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2">
          Каталог
        </Typography>
        <Typography variant="body1">
          Список продуктов, торгующихся на Московской бирже.
        </Typography>
        <CategoryToolbar />
        <TextField
          margin="normal"
          fullWidth
          label="Фильтр по названию, ISIN"
          autoComplete="filter-caption"
          value={filterValue}
          onChange={handleFilterChange}
        />
        {
          isFetching && (
            <Container sx={{ display: 'flex', justifyContent: 'center', marginY: 2 }}>
              <CircularProgress />
            </Container>
          )
        }
        <ErrorAlert error={error} />
        {items?.map((item) => {
          return (
            <BondCatalogCard data={item} key={item.isin} />
          )
        })}
      </Container>
    </>
  )
}
