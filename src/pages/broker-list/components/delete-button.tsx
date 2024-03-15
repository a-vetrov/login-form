import React, { useCallback, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide
} from '@mui/material'
import { type TransitionProps } from '@mui/material/transitions'
import { useDeleteBrokerTokenMutation } from '../../../services/broker.ts'

interface Props {
  id: string
}

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const DeleteButton: React.FC<Props> = ({ id }) => {
  const [open, setOpen] = useState(false)

  const [deleteTrigger] = useDeleteBrokerTokenMutation()

  const handleClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleDelete = useCallback(() => {
    setOpen(false)
    void deleteTrigger(id)
  }, [setOpen])

  return (
    <>
      <IconButton edge="end" aria-label="delete" onClick={handleClick}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Хотите удалить токен?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Отменить данную операцию не получится. Но можно будет добавить токен заново
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleDelete}>Удалить токен</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
