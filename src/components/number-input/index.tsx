import React, { useMemo } from 'react'

import { IMaskInput } from 'react-imask'
import { TextField } from '@mui/material'
import { type TextFieldProps } from '@mui/material/TextField/TextField'

interface CustomProps {
  onChange: (event: { target: { name: string, value: string } }) => void
  name: string
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
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

const inputProps = {
  inputComponent: TextMaskCustom as any
}

export const NumberInput: React.FC<TextFieldProps> = (props) => {
  const { sx } = props

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
        variant="outlined"
        {...props}
        sx={inputStyle}
      />
    </>
  )
}
