import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, AlertTitle, Box, Button, FormControl, NoSsr, Stack, Typography } from '@mui/material'
import { SearchProduct } from '../../components/search-product/search-product'
import { catalogApi, type GetCatalogResponseType } from '../../services/catalog'
import { ProductTitle } from './interval-bot/product-title'
import type { HistoricCandle } from '../../types/tinkoff/marketdata'
import { MoneyInput, type MoneyInputChangeType } from '../../components/money-input'
import { fromNumberToMoneyString, getFromMaskedValue, roundToMinPriceIncrement, setMaskedValue } from '../../utils/money'
import { NumberInput, type NumberInputChangeType } from '../../components/number-input'
import { calculateBudget, getCandlesInterval } from './interval-bot/utils'
import { BudgetControl } from './interval-bot/budget-control'
import { AccountControl } from './interval-bot/account-control'
import { AccountTypes } from '../../constants'
import { getMinMax } from '../../utils/math'
import { type AddIntervalBotData, useAddIntervalBotMutation, useGetBotsQuery } from '../../services/bots'
import { ErrorAlert } from '../../components/error-alert/error-alert'
import { DecimalInput } from '../../components/decimal-input'
import { BreadCrumbsWrapper } from '../../components/bread-crumbs/bread-crumbs-wrapper.tsx'
import { breadCrumbsConfig } from '../../components/bread-crumbs/config.ts'
import { CandleStickChartTradingView } from '../../components/candle-stick-chart/candle-stick-chart-trading-view.tsx'

const lowBoundaryInputName = 'low-boundary-input'
const highBoundaryInputName = 'high-boundary-input'

const defaultStepsCount = 10

export const CreateIntervalBot: React.FC = () => {
  const [product, setProduct] = useState<GetCatalogResponseType | null>(null)
  const [candles, setCandles] = useState<HistoricCandle[] | null>(null)

  const [lowBoundary, setLowBoundary] = useState<number>()
  const [highBoundary, setHighBoundary] = useState<number>()

  const [stepsCount, setStepsCount] = useState<number | undefined>(defaultStepsCount)
  const [stepProfit, setStepsProfit] = useState<number | null>(1)
  const [amountPerStep, setAmountPerStep] = useState<number>(1)

  const [accountType, setAccountType] = useState<AccountTypes>(AccountTypes.sandbox)
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)

  const [trigger, { isLoading, error: postError, isSuccess: isPostSuccess, data: postData }] = useAddIntervalBotMutation()
  const { data: botsListData } = useGetBotsQuery()

  const { data: marginData } = catalogApi.useGetFutureMarginByTickerQuery(product?.ticker ?? '', { skip: product?.type !== 'future' })

  const navigate = useNavigate()

  useEffect(() => {
    if (isPostSuccess && postData?.id) {
      navigate(`/bots/${postData.id}`)
    }
  }, [isPostSuccess, navigate, postData])

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

  const stepSize = useMemo(() => {
    if (lowBoundary === undefined || highBoundary === undefined || !stepsCount || stepsCount <= 1) {
      return undefined
    }
    return (highBoundary - lowBoundary) / (stepsCount - 1)
  }, [lowBoundary, highBoundary, stepsCount])

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
      setStepsCount(defaultStepsCount)
      return
    }
    const numericValue = getFromMaskedValue(value)

    if (numericValue !== null) {
      setStepsCount(numericValue)
    }
  }, [])

  const handleStepsProfitChange = useCallback<MoneyInputChangeType>((event) => {
    const { value } = event.target
    const numericValue = getFromMaskedValue(value)

    setStepsProfit(numericValue)
  }, [])

  const steps = useMemo(() => {
    if (!product || !stepsCount || !lowBoundary || !stepSize) {
      return undefined
    }
    const profit = stepProfit || 1
    const minPriceIncrement = product.minPriceIncrement || 0.01
    const stepsData = []
    for (let i = 0; i < stepsCount; i++) {
      const min = roundToMinPriceIncrement(lowBoundary + stepSize * i, minPriceIncrement)
      const max = roundToMinPriceIncrement(min + (profit * stepSize), minPriceIncrement)
      stepsData.push({ min, max, serialNumber: i })
    }
    return stepsData
  }, [lowBoundary, product, stepProfit, stepSize, stepsCount])

  const budget = useMemo(() => {
    if (!product || !amountPerStep) {
      return 0
    }
    return calculateBudget({
      lowBoundary,
      highBoundary,
      stepsCount,
      amountPerStep,
      productLots: product.lot,
      initialMarginOnBuy: marginData?.initialMarginOnBuy
    })
  }, [amountPerStep, highBoundary, lowBoundary, marginData, product, stepsCount])

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const bounds = (lowBoundary !== undefined && highBoundary !== undefined) ? getMinMax(lowBoundary, highBoundary) : undefined

    const result: AddIntervalBotData = {
      product: product?.uid,
      bounds,
      stepsCount,
      amountPerStep,
      accountType,
      selectedAccount,
      stepProfit
    }
    void trigger(result)
  }, [accountType, amountPerStep, highBoundary, lowBoundary, product?.uid, selectedAccount, stepProfit, stepsCount, trigger])

  const sameBotIsAlreadyExists = useMemo(() => {
    if (!product || !botsListData) {
      return false
    }

    return botsListData.some((item) => item.active && (item.properties.product as GetCatalogResponseType).isin === product.isin)
  }, [botsListData, product])

  return (
    <>
      <BreadCrumbsWrapper items={breadCrumbsConfig.createIntervalBot} />

      <Typography variant="h1" marginBottom={1}>
        Создать интервальный бот
      </Typography>
      {!product && <SearchProduct onChange={handleProductChange}/>}
      {(product && sameBotIsAlreadyExists) && (
        <Box marginTop={2}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleResetProduct}>
                Отмена
              </Button>
          }>
            <AlertTitle>Бот с таким продуктом уже существует!</AlertTitle>
            Нельзя создать несколько ботов для одного продукта.
            <Box marginTop={1}>
              <Button href="/bots" color="inherit">К списку ботов</Button>
              <Button color="inherit" onClick={handleResetProduct}>Выбрать другой продукт</Button>
            </Box>
          </Alert>
        </Box>
      )
      }
      {(product && !sameBotIsAlreadyExists) && (
        <Box component='form' onSubmit={handleSubmit}>
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
                value={setMaskedValue(stepsCount)}
                onChange={handleStepsCountChange}
              />
            </Box>

            {stepSize !== undefined && stepSize > 0 && (
              <Typography variant="body1" marginY={2}>
                Размер шага сетки {fromNumberToMoneyString(stepSize, 'RUB')}
              </Typography>
            )}

            <Box marginY={2}>
              <Typography variant="body1" marginBottom={1}>
                Профит одного шага
              </Typography>
                <DecimalInput
                  id="stepProfit"
                  name="stepProfit"
                  margin="dense"
                  label="В единицах размера шага"
                  required
                  autoComplete="off"
                  defaultValue={1}
                  onChange={handleStepsProfitChange}
                  error={!stepProfit || stepProfit <= 0}
                />
            </Box>

            <Box marginY={2}>
              {/* eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style */}
              <BudgetControl product={product} amountPerStep={amountPerStep} onChange={setAmountPerStep}/>
              <Typography variant="body1" marginTop={2}>
                Необходимый бюджет {fromNumberToMoneyString(budget, 'RUB')}
              </Typography>
            </Box>

            <Box marginY={2}>
              <AccountControl
                accountType={accountType}
                onChangeAccountType={setAccountType}
                selectedAccount={selectedAccount}
                onChangeSelectedAccount={setSelectedAccount}
                budget={budget}
              />
            </Box>

            <Box marginY={2}>
              <CandleStickChartTradingView instrumentId={product.uid} steps={steps} onChange={handleCandlesChange} />
            </Box>

            <ErrorAlert error={postError} />

            <NoSsr>
              <Button loading={isLoading} variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
                Создать интервальный бот
              </Button>
            </NoSsr>

            <Button variant="outlined" fullWidth onClick={handleResetProduct} sx={{ my: 1 }}>Отмена</Button>
          </FormControl>
        </Box>
      )}
    </>
  )
}
