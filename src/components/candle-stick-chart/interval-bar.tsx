import React, {useCallback, useState} from 'react'
import { Button, ButtonGroup } from '@mui/material'

const intervals = [
  {
    key: '1м',
    value: 1
  },
  {
    key: '5м',
    value: 2
  },
  {
    key: '15м',
    value: 3
  },
  {
    key: '30м',
    value: 4
  },
  {
    key: '1ч',
    value: 5
  },
  {
    key: '4ч',
    value: 6
  },
  {
    key: 'д',
    value: 7
  },
  {
    key: 'н',
    value: 8
  },
  {
    key: 'мес',
    value: 9
  }
]

export const CandleIntervalBar: React.FC = () => {
  const [selected, setSelected] = useState(3)

  const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement> >((event) => {
    const value = (event.currentTarget as HTMLButtonElement).dataset.value
    if (value) {
      setSelected(parseInt(value))
    }
  }, [setSelected])

  return (
    <ButtonGroup variant="outlined" size='small'>
      {
        intervals.map((item) => (
          <Button key={item.value} data-value={item.value} variant={selected === item.value ? 'contained' : 'outlined'} onClick={handleClick}>{item.key}</Button>
        ))
      }
    </ButtonGroup>
  )
}
