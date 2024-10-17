import React, { useCallback, useMemo, useState } from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  NoSsr,
  Select,
  Typography
} from '@mui/material'
import { useMatch, useNavigate } from 'react-router-dom'
import { MoneyInput } from '../../components/money-input'
import { NumberInput } from '../../components/number-input'
import LoadingButton from '@mui/lab/LoadingButton'
import { catalogApi } from '../../services/catalog'
import { ErrorAlert } from '../../components/error-alert/error-alert'
import { LastPrice } from '../../components/last-price/last-price'
import { type PostNewOrderParamsType, sandboxApi } from '../../services/sandbox'
import { SandboxAccountsList } from '../sandbox/components/accounts-list'
import { getFromMaskedValue } from '../../utils/money'
import { CandleStickChart } from '../../components/candle-stick-chart/candle-stick-chart'
import { getInstrumentName } from '../../utils/product'

const inputMargin = { mb: 2, mt: 2 }

export const OrderAddPage: React.FC = () => {
  const match = useMatch('/order/add/:id')
  const isin = match?.params.id

  const navigate = useNavigate()

  const { data, isLoading, error } = catalogApi.useGetInstrumentByIsinQuery(isin as unknown as string, { skip: !isin })
  const [postTrigger, { isLoading: postIsLoading, error: postError }] = sandboxApi.usePostNewOrderMutation()

  const accounts = sandboxApi.useGetAccountsQuery()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(undefined)

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const body = {
      quantity: getFromMaskedValue(formData.get('quantity') as string),
      price: getFromMaskedValue(formData.get('price') as string),
      direction: 1, // Покупка
      accountId: selectedAccount,
      orderType: getFromMaskedValue(formData.get('order_type') as string),
      instrumentId: data?.uid,
      time_in_force: 1,
      price_type: 2
    }
    console.log(body)
    void postTrigger(body as PostNewOrderParamsType)
  }, [data?.uid, postTrigger, selectedAccount])

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const lotSize = useMemo(() => {
    if (data?.lot) {
      return (
        <Typography variant="body1">
          {`1 лот = ${data?.lot} шт`}
        </Typography>
      )
    }
    return null
  }, [data?.lot])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h1">
          Выставление заявки на покупку
        </Typography>

        {isLoading && <CircularProgress />}

        <ErrorAlert error={error} />

        {data !== undefined && (
          <>
            <Typography variant="h2">
              {getInstrumentName(data)}
            </Typography>
            {data.uid && <CandleStickChart instrumentId={data.uid} />}
            <SandboxAccountsList accounts={accounts.data?.accounts}
                                 selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount}
                                 titleVisible={false} controlsVisible={false}/>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, maxWidth: '500px' }}>
              <FormControl fullWidth sx={inputMargin}>
                <InputLabel id="order-type-select-label">Тип заявки</InputLabel>
                <Select
                  labelId="order-type-select-label"
                  id="order-type-select"
                  name="order_type"
                  label="Тип заявки"
                  defaultValue={1}
                >
                  <MenuItem value={1}>Лимитная</MenuItem>
                  <MenuItem value={2}>Рыночная</MenuItem>
                  <MenuItem value={3}>Лучшая цена</MenuItem>
                </Select>
              </FormControl>

              <NumberInput
                name="quantity"
                fullWidth
                required
                label="Количество лотов"
                sx={inputMargin}
              />
                {lotSize}

              <MoneyInput
                name="price"
                fullWidth
                required
                label="Цена за 1 инструмент"
                sx={inputMargin}
              />

              <LastPrice uid={data.uid} />

              <ErrorAlert error={postError} />

              <NoSsr>
                <LoadingButton loading={postIsLoading} variant="contained" type="submit" fullWidth sx={inputMargin}>
                  Создать заявку
                </LoadingButton>
              </NoSsr>

              <Button variant="outlined" fullWidth sx={inputMargin} onClick={handleCancel}>Отмена</Button>

            </Box>
          </>
        )}

      </Container>
    </>
  )
}
