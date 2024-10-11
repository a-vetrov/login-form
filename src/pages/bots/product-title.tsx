import React, { useMemo } from 'react'
import { type GetCatalogResponseType } from '../../services/catalog'
import { getInstrumentName } from '../../utils/product'
import {Box, IconButton, Stack, Typography} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

interface Props {
  data: GetCatalogResponseType
  onReset: () => void
}

export const ProductTitle: React.FC<Props> = ({ data, onReset }) => {
  const title = useMemo(() => getInstrumentName(data as unknown as Record<string, unknown>), [data])
  return (
    <Box marginTop={2}>
      <Typography variant="body1">
        Выбранный продукт:
      </Typography>
      <Typography variant="h3">
        {title}
        <IconButton aria-label="edit" sx={{ verticalAlign: 'top', ml: 2 }} onClick={onReset}>
          <EditIcon />
        </IconButton>
      </Typography>
    </Box>
  )
}
