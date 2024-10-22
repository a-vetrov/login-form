import React, { useCallback, useMemo, useState } from 'react'
import { CircularProgress, TextField, Typography } from '@mui/material'
import { catalogApi, type CatalogProductType, type GetCatalogResponseType } from '../../services/catalog'
import { CatalogCard } from './catalog-card'
import { ErrorAlert } from '../error-alert/error-alert'

const MAX_LIST_SIZE = 15

const typeTitles: Record<CatalogProductType, string> = {
  bond: 'Облигации',
  stock: 'Акции',
  currency: 'Валюта'
}

interface Props {
  onChange: (item: GetCatalogResponseType) => void
}

export const SearchProduct: React.FC<Props> = ({ onChange }) => {
  const [filterValue, setFilterValue] = useState('')
  const { data, error, isLoading } = catalogApi.useGetCatalogQuery()

  const handleFilterChange = useCallback<React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>((event) => {
    const newValue = event.target.value
    setFilterValue(newValue)
  }, [setFilterValue])

  const handleItemClick = useCallback((item: GetCatalogResponseType) => {
    onChange(item)
  }, [onChange])

  const listData = useMemo(() => {
    if (!data || !filterValue) {
      return null
    }

    const filterLowerCase = filterValue.toLowerCase()

    const filteredData = data.filter((item) => {
      return item.name.toLowerCase().includes(filterLowerCase) ||
        item.isin.toLowerCase().includes(filterLowerCase) ||
        item.ticker?.toLowerCase().includes(filterLowerCase) ||
        item.figi?.toLowerCase().includes(filterLowerCase)
    })

    const dict: Record<CatalogProductType, GetCatalogResponseType[]> = filteredData.reduce<Record<CatalogProductType, GetCatalogResponseType[]>>((accumulator, item) => {
      if (!accumulator[item.type]) {
        accumulator[item.type] = []
      }
      if (accumulator[item.type].length < MAX_LIST_SIZE) {
        accumulator[item.type].push(item)
      }
      return accumulator
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter,@typescript-eslint/consistent-type-assertions
    }, {} as Record<CatalogProductType, GetCatalogResponseType[]>)

    return Object.keys(dict).map((key) => ({
      type: typeTitles[key as CatalogProductType],
      data: dict[key as CatalogProductType]
    }))
  }, [data, filterValue])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <ErrorAlert error={error} />
  }

  return (
    <>
      <TextField
        margin="normal"
        fullWidth
        label="Поиск по названию, ISIN, ticker"
        autoComplete="product-name"
        value={filterValue}
        onChange={handleFilterChange}
      />

      {listData?.map((category) => (
        <React.Fragment key={category.type}>
          <Typography variant="h3" marginTop={2}>
            {category.type}
          </Typography>
          {category.data.map(item => (
            <CatalogCard data={item} key={item.uid} onClick={handleItemClick}/>
          ))}
        </React.Fragment>
      ))}
    </>
  )
}
