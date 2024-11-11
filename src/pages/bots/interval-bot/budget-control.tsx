import React, { useCallback, useMemo } from 'react'
import { Typography } from '@mui/material'
import { NumberInput, type NumberInputChangeType } from '../../../components/number-input'
import type { GetCatalogResponseType } from '../../../services/catalog'
import { getFromMaskedValue, setMaskedValue } from '../../../utils/money'

interface Props {
  product: GetCatalogResponseType
  onChange: (value: number) => void
  amountPerStep: number
}

export const BudgetControl: React.FC<Props> = ({ product, onChange, amountPerStep }) => {
  const handleChange = useCallback<NumberInputChangeType>((event) => {
    const { value } = event.target
    const numericValue = getFromMaskedValue(value)

    if (numericValue !== null) {
      onChange(numericValue)
    }
  }, [onChange])

  const title = useMemo(() => {
    return `Количество лотов в одной заявке (шаге сетки). Лотность продукта ${product.lot}.`
  }, [product.lot])

  const errorMessage = useMemo(() => {
    if (amountPerStep <= 0) {
      return 'Нулевой объем.'
    }
    return ''
  }, [amountPerStep])

  return (
    <>
      <Typography variant="body1" marginBottom={1}>
        {title}
      </Typography>
      <NumberInput
        name="amountPerStep"
        required
        label='Количество лотов'
        value={setMaskedValue(amountPerStep)}
        autoComplete="off"
        onChange={handleChange}
        error={errorMessage !== ''}
        helperText={errorMessage}
      />
    </>
  )
}
