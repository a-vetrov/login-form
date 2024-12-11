import React, { useMemo } from 'react'
import { Typography } from '@mui/material'
import { type BotsListDataType } from '../../../services/bots'
import { StopBotButton } from './stop-button'

interface Props {
  data: BotsListDataType
}

export const IntervalBotDetails: React.FC<Props> = ({ data }) => {
  const { id, active } = data

  const activeLabel = useMemo(() => {
    if (active) {
      return <Typography variant='subtitle1' color='success.main'>Активен</Typography>
    } else {
      return <Typography variant='subtitle1' color='error.light'>Остановлен</Typography>
    }
  }, [active])

  return (
    <>
      <Typography variant="h1" marginBottom={1}>
        Интервальный бот
      </Typography>
      {activeLabel}
      {active && <StopBotButton id={id}/>}
    </>
  )
}
