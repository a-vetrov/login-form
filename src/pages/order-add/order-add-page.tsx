import React, { useCallback } from 'react'
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
import { getInstrumentName } from './utils'
import { LastPrice } from '../../components/last-price/last-price'

const inputMargin = { mb: 2, mt: 2 }

export const OrderAddPage: React.FC = () => {
  const match = useMatch('/order/add/:id')
  const isin = match?.params.id

  const navigate = useNavigate()

  const { data, isLoading, error } = catalogApi.useGetInstrumentByIsinQuery(isin as unknown as string, { skip: !isin })

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    console.log(formData)
  }, [])

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [])

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2">
          Выставление заявки на покупку
        </Typography>

        {isLoading && <CircularProgress />}

        <ErrorAlert error={error} />

        {data !== undefined && (
          <>
            <Typography variant="h3">
              {getInstrumentName(data)}
            </Typography>
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

            <MoneyInput
              name="price"
              fullWidth
              required
              label="Цена за 1 инструмент"
              sx={inputMargin}
            />

              <LastPrice uid={data?.uid} />

            <NoSsr>
              <LoadingButton loading={isLoading} variant="contained" type="submit" fullWidth sx={inputMargin}>
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
