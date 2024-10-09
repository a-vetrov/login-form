import React, {useState} from 'react'
import { MainToolbar } from '../../components/main-toolbar'
import { Container, Typography } from '@mui/material'

export const CreateIntervalBot: React.FC = () => {
  const [productFilterValue, setProductFilterValue] = useState('')

  return (
    <>
      <MainToolbar />
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2">
          Создать интервальный бот
        </Typography>
      </Container>
    </>
  )
}
