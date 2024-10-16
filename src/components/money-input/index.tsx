import React, { useMemo } from 'react'

import { IMaskInput } from 'react-imask'
import { InputAdornment, TextField } from '@mui/material'
import { type TextFieldProps } from '@mui/material/TextField/TextField'
import { type CurrencyCodeType, getCurrencySign, mainCurrencies } from '../../utils/money'

export type MoneyInputChangeType = (event: { target: { name: string, value: string } }) => void

interface CustomProps {
  onChange: MoneyInputChangeType
  name: string
}

export const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom (props, ref) {
    const { onChange, ...other } = props
    return (
      <IMaskInput
        {...other}
        mask={Number}
        scale={2}
        thousandsSeparator=' '
        inputRef={ref}
        onAccept={(value: any) => { onChange({ target: { name: props.name, value } }) }}
        overwrite
      />
    )
  }
)

interface MoneyPropsType {
  currency?: CurrencyCodeType
}

export const MoneyInput: React.FC<TextFieldProps & MoneyPropsType> = (props) => {
  const { currency = mainCurrencies.RUB, sx } = props

  const inputProps = useMemo(() => {
    return {
      inputComponent: TextMaskCustom as any,
      endAdornment: <InputAdornment position="end">{getCurrencySign(currency)}</InputAdornment>
    }
  }, [currency])

  const inputStyle = useMemo(() => {
    return { input: { textAlign: 'right' }, ...sx }
  }, [sx])

  return (
    <>
      <TextField
        label="react-number-format"
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={inputProps}
        sx={inputStyle}
        variant="outlined"
        {...props}
      />
    </>
  )
}
