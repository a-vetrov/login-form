import React, { useCallback } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { sandboxApi } from '../../../services/sandbox'
import { MoneyInput } from '../../../components/money-input'
import { getFromMaskedValue } from '../../../utils/money'

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
      money: getFromMaskedValue(formData.get('money') as string),
      id
    }
    addMoneyTrigger(json)
  }, [id])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        variant: 'standard'
      }}
    >
      <DialogTitle>Добавить денег</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Добавить виртуальных денег на выбранный счет в Песочнице.
        </DialogContentText>
        <MoneyInput
          id="formatted-text-mask-input2"
          name="money"
          fullWidth
          autoFocus
          required
          margin="dense"
          label="Введите сумму"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit">Добавить</Button>
      </DialogActions>
    </Dialog>
  )
}
