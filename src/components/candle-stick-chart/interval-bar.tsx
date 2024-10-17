import React, { useCallback } from 'react'
import { Button, ButtonGroup } from '@mui/material'

const intervals = [
  {
    key: '1м',
    value: 1
  },
  {
    key: '2м',
    value: 6
  },
  {
    key: '3м',
    value: 7
  },
  {
    key: '5м',
    value: 2
  },
  {
    key: '10м',
    value: 8
  },
  {
    key: '15м',
    value: 3
  },
  {
    key: '30м',
    value: 9
  },
  {
    key: '1ч',
    value: 4
  },
  {
    key: '4ч',
    value: 11
  },
  {
    key: 'д',
    value: 5
  },
]

interface Props {
  interval: number
  onChange: (value: number) => void
}

export const CandleIntervalBar: React.FC<Props> = ({ interval, onChange }) => {
  const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement> >((event) => {
    const value = (event.currentTarget as HTMLButtonElement).dataset.value
    if (value) {
      onChange(parseInt(value))
    }
  }, [onChange])

  return (
    <ButtonGroup variant="outlined" size='small' sx={{width: '100%'}}>
      {
        intervals.map((item) => (
          <Button
            key={item.value}
            data-value={item.value}
            variant={interval === item.value ? 'contained' : 'outlined'}
            onClick={handleClick}>{item.key}
          </Button>
        ))
      }
    </ButtonGroup>
  )
}
