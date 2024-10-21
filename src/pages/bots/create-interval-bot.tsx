import React, { useCallback, useMemo, useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Box, Button, Container, FormControl, NoSsr, Stack, Typography } from '@mui/material'
import { SearchProduct } from '../../components/search-product/search-product'
import type { GetCatalogResponseType } from '../../services/catalog'
import { ProductTitle } from './product-title'
import { CandleStickChart } from '../../components/candle-stick-chart/candle-stick-chart'
import type { HistoricCandle } from '../../types/tinkoff/marketdata'
import { MoneyInput, type MoneyInputChangeType } from '../../components/money-input'
import { getFromMaskedValue, setMaskedValue } from '../../utils/money'
import { NumberInput, type NumberInputChangeType } from '../../components/number-input'
import LoadingButton from '@mui/lab/LoadingButton'
import { getCandlesInterval } from './utils'

const lowBoundaryInputName = 'low-boundary-input'
const highBoundaryInputName = 'high-boundary-input'

export const CreateIntervalBot: React.FC = () => {
  const [product, setProduct] = useState<GetCatalogResponseType | null>(null)
  const [candles, setCandles] = useState<HistoricCandle[] | null>(null)

  const [lowBoundary, setLowBoundary] = useState<number>()
  const [highBoundary, setHighBoundary] = useState<number>()

  const [stepsCount, setStepsCount] = useState<number>(10)

  const boundaryLabel = useMemo(() => {
    if (lowBoundary === undefined || highBoundary === undefined || lowBoundary < highBoundary) {
      return {
        low: 'Нижняя граница',
        high: 'Верхняя граница'
      }
    }
    return {
      low: 'Верхняя граница',
      high: 'Нижняя граница'
    }
  }, [highBoundary, lowBoundary])

  const handleProductChange = useCallback((item: GetCatalogResponseType) => {
    setProduct(item)
  }, [setProduct])

  const handleResetProduct = useCallback(() => {
    setProduct(null)
  }, [setProduct])

  const handleCandlesChange = useCallback((candles: HistoricCandle[]) => {
    setCandles(candles)
    if (lowBoundary === undefined || highBoundary === undefined) {
      const bounds = getCandlesInterval(candles)
      if (lowBoundary === undefined) {
        setLowBoundary(bounds.low)
      }
      if (highBoundary === undefined) {
        setHighBoundary(bounds.high)
      }
    }
  }, [highBoundary, lowBoundary])

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

  const handleStepsCountChange = useCallback<NumberInputChangeType>((event) => {
    const { value } = event.target

    if (!value) {
      setStepsCount(undefined)
      return
    }
    const numericValue = getFromMaskedValue(value)

    if (numericValue !== null) {
      setStepsCount(numericValue)
    }
  }, [])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h1" marginBottom={1}>
          Создать интервальный бот
        </Typography>
        {!product && <SearchProduct onChange={handleProductChange}/>}
        {product && (
          <>
            <ProductTitle data={product} onReset={handleResetProduct}/>

            <FormControl fullWidth>

              <Box marginY={2}>
                <Typography variant="body1" marginBottom={1}>
                  Границы интервала
                </Typography>
                <Stack direction="row" spacing={2} marginY={2}>
                  <MoneyInput
                    id={lowBoundaryInputName}
                    name={lowBoundaryInputName}
                    margin="dense"
                    label={boundaryLabel.low}
                    onChange={handleBoundaryChange}
                    error={lowBoundary === highBoundary}
                    required
                    autoComplete="off"
                    value={lowBoundary !== undefined ? setMaskedValue(lowBoundary) : lowBoundary}
                  />
                  <MoneyInput
                    id={highBoundaryInputName}
                    name={highBoundaryInputName}
                    margin="dense"
                    label={boundaryLabel.high}
                    onChange={handleBoundaryChange}
                    error={lowBoundary === highBoundary}
                    required
                    autoComplete="off"
                    value={highBoundary !== undefined ? setMaskedValue(highBoundary) : highBoundary}
                  />
                </Stack>
              </Box>

              <Box marginY={2}>
                <Typography variant="body1" marginBottom={1}>
                  Число шагов сетки в интервале
                </Typography>
                <NumberInput
                  name="stepsQuantity"
                  required
                  label="Количество шагов"
                  defaultValue={10}
                  error={stepsCount !== undefined && stepsCount < 2}
                  autoComplete="off"
                  onChange={handleStepsCountChange}
                />
              </Box>

              <Box marginY={2}>
                <CandleStickChart
                  instrumentId={product.uid}
                  onChange={handleCandlesChange}
                  lowBoundary={lowBoundary}
                  highBoundary={highBoundary}
                  stepsCount={stepsCount}
                />
              </Box>

              <NoSsr>
                <LoadingButton loading={false} variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
                  Создать интервальный бот
                </LoadingButton>
              </NoSsr>

              <Button variant="outlined" fullWidth onClick={handleResetProduct} sx={{ my: 1 }}>Отмена</Button>
            </FormControl>
          </>
        )}
      </Container>
    </>
  )
}
