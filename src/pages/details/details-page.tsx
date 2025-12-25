import React from 'react'
import { Button } from '@mui/material'
import { useMatch, Link as RouterLink } from 'react-router-dom'
import { getDetailsCardClass } from './factory'
import type { CatalogCategoryName } from '../catalog/utils/category-list'

export const DetailsPage: React.FC = () => {
  const match = useMatch('/catalog/:category/:id')
  const isin = match?.params.id

  const Details = getDetailsCardClass(match?.params.category as CatalogCategoryName | undefined)

  return (
    <>
      {Details && isin && (
        <>
          <Details isin={isin} ticker={isin}/>
          <Button
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            fullWidth
            component={RouterLink}
            to={`/order/add/${isin}`}
          >
            Добавить в песочницу
          </Button>
        </>
      )}
    </>
  )
}
