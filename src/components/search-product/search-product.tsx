import React, { useCallback, useMemo, useState } from 'react'
import { TextField } from '@mui/material'
import { catalogApi } from '../../services/catalog'

export const SearchProduct: React.FC = () => {
  const [filterValue, setFilterValue] = useState('')
  const { data, error, isLoading } = catalogApi.useGetCatalogQuery()

  const handleFilterChange = useCallback<React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>((event) => {
    const newValue = event.target.value
    setFilterValue(newValue)
  }, [setFilterValue])

  const listData = useMemo(() => {
    if (!data || !filterValue) {
      return null
    }

    const filterLowerCase = filterValue.toLowerCase()

    const filteredData = data.filter((item) => {
      return item.name.toLowerCase().includes(filterLowerCase) ||
        item.isin.toLowerCase().includes(filterLowerCase) ||
        item.ticker?.toLowerCase().includes(filterLowerCase)
    })

    return filteredData
  }, [data, filterValue])

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

      {listData?.map((item) => (
        <div key={item.uid}>
          {item.name}
        </div>
      ))}
    </>
  )
}
