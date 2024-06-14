import React, { useMemo } from 'react'

import { IMaskInput } from 'react-imask'
import { InputAdornment, TextField } from '@mui/material'
import { type TextFieldProps } from '@mui/material/TextField/TextField'
import { type CurrencyCodeType, getCurrencySign, mainCurrencies } from '../../utils/money'

interface CustomProps {
  onChange: (event: { target: { name: string, value: string } }) => void
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

const inputStyle = { input: { textAlign: 'right' } }

export const MoneyInput: React.FC<TextFieldProps & MoneyPropsType> = (props) => {
  const { currency = mainCurrencies.RUB } = props

  const inputProps = useMemo(() => {
    return {
      inputComponent: TextMaskCustom as any,
      endAdornment: <InputAdornment position="end">{getCurrencySign(currency)}</InputAdornment>
    }
  }, [currency])

  return (
    <>
      <TextField
        label="react-number-format"
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={inputProps}
        sx={inputStyle}
        variant="standard"
        {...props}
      />
    </>
  )
}
