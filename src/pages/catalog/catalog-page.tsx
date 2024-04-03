import React, { useCallback, useMemo, useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, TextField, Typography } from '@mui/material'
import { CategoryToolbar } from './components/category-toolbar.tsx'
import { catalogApi } from '../../services/catalog.ts'
import { BondCatalogCard } from '../../components/catalog-card/bond.tsx'

export const CatalogPage: React.FC = () => {
  const { data, error } = catalogApi.useGetBondsQuery()

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
        return item.name.toLowerCase().includes(filterLowerCase) || item.isin.toLowerCase().includes(filterLowerCase)
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
        {items?.map((item) => {
          return (
            <BondCatalogCard data={item} key={item.isin} />
          )
        })}
      </Container>
    </>
  )
}
