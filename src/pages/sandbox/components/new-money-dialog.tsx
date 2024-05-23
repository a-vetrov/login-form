import React, { useCallback } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import {sandboxApi} from '../../../services/sandbox';

interface Props {
  open: boolean
  onClose: () => void
  id: string | undefined
}

export const NewMoneyDialog: React.FC<Props> = ({ open, onClose, id }) => {
  const [addMoneyTrigger, { isLoading: createIsLoading }] = sandboxApi.useAddNewMoneyMutation()

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id) {
      return
    }
    const formData = new FormData(event.currentTarget)
    const json = {
      money: parseFloat(formData.get('money') as string),
      id
    }
    console.log('formData', json)
    addMoneyTrigger(json)
  }, [id])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle>Добавить денег</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Добавить виртуальных денег на выбранный счет в Песочнице.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="money"
          name="money"
          label="Введите сумму"
          type="number"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit">Добавить</Button>
      </DialogActions>
    </Dialog>
  )
}
