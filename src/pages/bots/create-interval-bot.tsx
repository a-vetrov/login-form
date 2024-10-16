import React, { useCallback, useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Box, Container, Stack, Typography } from '@mui/material'
import { SearchProduct } from '../../components/search-product/search-product'
import type { GetCatalogResponseType } from '../../services/catalog'
import { ProductTitle } from './product-title'
import { CandleStickChart } from '../../components/candle-stick-chart/candle-stick-chart'
import type { HistoricCandle } from '../../types/tinkoff/marketdata'
import { MoneyInput, type MoneyInputChangeType } from '../../components/money-input'
import { getFromMaskedValue } from '../../utils/money'

const lowBoundaryInputName = 'low-boundary-input'
const highBoundaryInputName = 'high-boundary-input'

export const CreateIntervalBot: React.FC = () => {
  const [product, setProduct] = useState<GetCatalogResponseType | null>(null)
  const [candles, setCandles] = useState<HistoricCandle[] | null>(null)

  const [lowBoundary, setLowBoundary] = useState<number>()
  const [highBoundary, setHighBoundary] = useState<number>()

  const handleProductChange = useCallback((item: GetCatalogResponseType) => {
    setProduct(item)
  }, [setProduct])

  const handleResetProduct = useCallback(() => {
    setProduct(null)
  }, [setProduct])

  const handleCandlesChange = useCallback((candles: HistoricCandle[]) => {
    setCandles(candles)
  }, [setCandles])

  const handleBoundaryChange = useCallback<MoneyInputChangeType>((event) => {
    const { name, value } = event.target

    const numericValue = getFromMaskedValue(value)
    if (numericValue !== null) {
      switch (name) {
        case lowBoundaryInputName: setLowBoundary(numericValue); break
        case highBoundaryInputName: setHighBoundary(numericValue); break
      }
    }
  }, [])

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

            <Box marginY={4}>
            <Typography variant="body1" marginBottom={1}>
              Границы интервала
            </Typography>
              <Stack direction="row" spacing={2} marginY={2}>
                <MoneyInput
                  id={lowBoundaryInputName}
                  name={lowBoundaryInputName}
                  margin="dense"
                  label="Нижняя граница"
                  value={lowBoundary?.toString()}
                  onChange={handleBoundaryChange}
                />
                <MoneyInput
                  id={highBoundaryInputName}
                  name={highBoundaryInputName}
                  margin="dense"
                  label="Верхняя граница"
                  value={highBoundary?.toString()}
                  onChange={handleBoundaryChange}
                />
              </Stack>
            </Box>
            <Box marginY={2}>
              <CandleStickChart
                instrumentId={product.uid}
                onChange={handleCandlesChange}
                lowBoundary={lowBoundary}
                highBoundary={highBoundary}
              />
            </Box>
          </>
        )}
      </Container>
    </>
  )
}
