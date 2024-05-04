import { styled } from '@mui/material/styles'
import { Card } from '@mui/material'

interface ChipProps {
  raised?: boolean
}

export const CardStyled = styled(Card)<ChipProps>(({ raised }) => ({
  border: '1px solid #485880',
  background: 'none',
  cursor: 'pointer',
  ...(raised && {
    backgroundColor: 'rgba(2, 41, 79, 0.2)'
  }),
  '&:hover': {
    background: 'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
    borderColor: 'primary.dark',
    boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5)'
  }
}))
