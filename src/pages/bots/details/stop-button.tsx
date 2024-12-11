import React, { useCallback } from 'react'
import { useStopBotMutation } from '../../../services/bots'
import { Button } from '@mui/material'

interface Props {
  id: string
}

export const StopBotButton: React.FC<Props> = ({ id }) => {
  const [trigger, data] = useStopBotMutation()

  const handleClick = useCallback(() => {
    void trigger(id)
  }, [trigger, id])

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={handleClick}
      sx={{ my: 1 }}
      disabled={data.isLoading || data.isSuccess}>
      Остановить
    </Button>
  )
}
