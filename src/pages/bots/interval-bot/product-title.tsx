import React, { useMemo } from 'react'
import { type GetCatalogResponseType } from '../../../services/catalog'
import { getInstrumentName } from '../../../utils/product'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { getIds } from '../../details/utils'

interface Props {
  data: GetCatalogResponseType
  onReset: () => void
}

export const ProductTitle: React.FC<Props> = ({ data, onReset }) => {
  const title = useMemo(() => getInstrumentName(data as unknown as Record<string, unknown>), [data])
  const ids = useMemo(() => getIds(data as unknown as Record<string, string>), [data])
  return (
    <Box marginY={4}>
      <Typography variant="body1">
        Выбранный продукт:
      </Typography>
      <Stack direction='row'>
        <div>
          <Typography variant="h3">
            {title}
          </Typography>
          <Typography variant="body1">
            {ids}
          </Typography>
        </div>
        <IconButton aria-label="edit" sx={{ verticalAlign: 'top', ml: 2, height: '40px' }} onClick={onReset}>
          <EditIcon />
        </IconButton>
      </Stack>
    </Box>
  )
}
