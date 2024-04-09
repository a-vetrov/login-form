import React from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container } from '@mui/material'
import { useMatch } from 'react-router-dom'
import { getDetailsCardClass } from './factory'
import type { CatalogCategoryName } from '../catalog/utils/category-list'

export const DetailsPage: React.FC = () => {
  const match = useMatch('/catalog/:category/:id')
  const isin = match?.params.id

  const Details = getDetailsCardClass(match?.params.category as CatalogCategoryName | undefined)

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        {Details && isin && <Details isin={isin} ticker={isin}/>}
      </Container>

    </>
  )
}
