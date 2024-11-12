import React from 'react'
import { Typography } from '@mui/material'
import { type BotsListDataType } from '../../../services/bots'

interface Props {
  data: BotsListDataType
}

export const IntervalBotDetails: React.FC<Props> = ({ data }) => {
  console.log('Интервальный бот')
  return (
    <>
      <Typography variant="h1" marginBottom={1}>
        Интервальный бот
      </Typography>
    </>
  )
}
