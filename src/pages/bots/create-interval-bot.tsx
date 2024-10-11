import React, { useCallback, useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, Typography } from '@mui/material'
import { SearchProduct } from '../../components/search-product/search-product'
import type { GetCatalogResponseType } from '../../services/catalog'
import { ProductTitle } from './product-title'
import {CandleStickChart} from '../../components/candle-stick-chart/candle-stick-chart';

export const CreateIntervalBot: React.FC = () => {
  const [product, setProduct] = useState<GetCatalogResponseType | null>(null)

  const handleProductChange = useCallback((item: GetCatalogResponseType) => {
    setProduct(item)
  }, [setProduct])

  const handleResetProduct = useCallback(() => {
    setProduct(null)
  }, [setProduct])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2" marginBottom={1}>
          Создать интервальный бот
        </Typography>
        {!product && <SearchProduct onChange={handleProductChange}/>}
        {product && (
          <>
            <ProductTitle data={product} onReset={handleResetProduct}/>
            <CandleStickChart instrumentId={product.uid}/>
          </>
        )}
      </Container>
    </>
  )
}
