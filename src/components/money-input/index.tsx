import React from 'react'

import { IMaskInput } from 'react-imask'

interface CustomProps {
  onChange: (event: { target: { name: string, value: string } }) => void
  name: string
}

export const MoneyInput = React.forwardRef<HTMLInputElement, CustomProps>(
  function MoneyInput (props, ref) {
    const { onChange, ...other } = props
    return (
      <IMaskInput
        {...other}
        mask={Number}
        inputRef={ref}
        onAccept={(value: any) => { onChange({ target: { name: props.name, value } }) }}
        overwrite
      />
    )
  }
)
