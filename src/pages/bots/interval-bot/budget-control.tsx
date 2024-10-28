import React, { useCallback, useMemo } from 'react'
import { Typography } from '@mui/material'
import { NumberInput, type NumberInputChangeType } from '../../../components/number-input'
import type { GetCatalogResponseType } from '../../../services/catalog'
import {getFromMaskedValue, setMaskedValue} from '../../../utils/money'

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

  const instrumentType = useMemo<string>(() => {
    switch (product.type) {
      case 'stock': return 'Количество акций'
      case 'bond': return 'Количество облигаций'
      case 'currency' :
      default: return 'Объем'
    }
  }, [product.type])

  const title = useMemo(() => {
    return `${instrumentType} в одной заявке (шаге сетки), учитывая лотность продукта ${product.lot}.`
  }, [instrumentType, product.lot])

  const errorMessage = useMemo(() => {
    if (amountPerStep <= 0) {
      return 'Нулевой объем.'
    }
    if (amountPerStep % product.lot !== 0) {
      return `Лотность продукта ${product.lot}.`
    }
    return ''
  }, [amountPerStep, product.lot])

  return (
    <>
      <Typography variant="body1" marginBottom={1}>
        {title}
      </Typography>
      <NumberInput
        name="amountPerStep"
        required
        label={instrumentType}
        value={setMaskedValue(amountPerStep)}
        autoComplete="off"
        onChange={handleChange}
        error={errorMessage !== ''}
        helperText={errorMessage}
      />
    </>
  )
}
