import React from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, Typography } from '@mui/material'
import { CategoryToolbar } from './components/category-toolbar.tsx'
import { catalogApi } from '../../services/catalog.ts'
import { BondCatalogCard } from '../../components/catalog-card/bond.tsx'

export const CatalogPage: React.FC = () => {
  const { data, error } = catalogApi.useGetBondsQuery()

  console.log('Data!!!!!!', data)

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
        {data?.instruments?.slice(0, 100).map((item) => {
          return (
            <BondCatalogCard data={item} key={item.isin} />
          )
        })}
      </Container>
    </>
  )
}
