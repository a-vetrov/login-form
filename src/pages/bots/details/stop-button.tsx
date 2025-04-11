import React, { useCallback, useState } from 'react'
import { useStopBotMutation } from '../../../services/bots'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface Props {
  id: string
}

export const StopBotButton: React.FC<Props> = ({ id }) => {
  const [trigger, data] = useStopBotMutation()
  const [open, setOpen] = useState(false)

  const handleStop = useCallback(() => {
    void trigger(id)
  }, [trigger, id])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        onClick={handleOpen}
        sx={{ my: 1 }}
        disabled={data.isLoading || data.isSuccess}>
        Остановить
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Остановить бот?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Уверены, что хотите остановить бота?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Нет</Button>
          <Button onClick={handleStop} autoFocus>
            Остановить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
