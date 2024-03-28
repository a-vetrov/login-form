import React from 'react'
import { Alert, AlertTitle, Box } from '@mui/material'

interface Props {
  error?: unknown
}

export const ErrorAlert: React.FC<Props> = ({ error }) => {
  if (!error) {
    return null
  }

  return (
    <Box marginTop={2}>
      <Alert severity="warning">
        {error.data?.error?.title && <AlertTitle>{error.data.error.title}</AlertTitle>}
        {error.data?.error?.message || 'Что-то пошло не так'}
      </Alert>
    </Box>
  )
}
