import React from 'react'

import { IMaskInput } from 'react-imask'
import {FormControl, Input, InputAdornment, InputLabel, TextField} from '@mui/material'
import {TextFieldProps} from '@mui/material/TextField/TextField';

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

export const MoneyInput: React.FC<TextFieldProps> = (props) => {
  return (
    <>
      <TextField
        label="react-number-format"
        name="numberformat"
        id="formatted-numberformat-input"
        InputProps={{
          inputComponent: TextMaskCustom as any,
          endAdornment: <InputAdornment position="end">$</InputAdornment>
        }}
        sx={{ input: { textAlign: 'right' } }}
        variant="standard"
        {...props}
      />
    </>
  )
}
