import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { type SystemCssProperties } from '@mui/system/styleFunctionSx/styleFunctionSx'

interface Props {
  link?: string
  title: string
  Icon?: React.FC
  shifted?: boolean
  onClick?: () => void
}

export const MenuItemLink: React.FC<Props> = ({ link, title, Icon, shifted, onClick }) => {
  const sx = useMemo(() => {
    const result: SystemCssProperties = {
      py: '6px',
      px: '12px'
    }
    if (shifted) {
      result.pl = 6
    }
    return result
  }, [shifted])

  const linkParams = useMemo(() => {
    return link
      ? {
          component: Link,
          to: link
        }
      : null
  }, [link])

  return (
    <MenuItem sx={sx} {...linkParams} onClick={onClick}>
      {Icon && (
        <ListItemIcon>
          <Icon/>
        </ListItemIcon>
      )}
      <ListItemText>
        {title}
      </ListItemText>
    </MenuItem>
  )
}
