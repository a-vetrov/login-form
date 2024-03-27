import React, { useMemo } from 'react'

import { ListItemText } from '@mui/material'
import { TokenType } from '../../../services/broker.ts'

interface Props {
  type: TokenType
}

export const TokenTypeLabel: React.FC<Props> = ({ type }) => {
  const primaryTypographyProps = useMemo(() => ({
    color: type === TokenType.real ? 'success.main' : 'text.secondary',
    fontWeight: 'medium',
    variant: 'body2'
  }), [type])

  const text = type === TokenType.real ? 'Боевой' : 'Sandbox'

  return (
    <ListItemText primary={text} primaryTypographyProps={primaryTypographyProps}/>
  )
}
