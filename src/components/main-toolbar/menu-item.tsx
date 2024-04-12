import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { type SystemCssProperties } from '@mui/system/styleFunctionSx/styleFunctionSx'

interface Props {
  link: string
  title: string
  Icon?: React.FC
  shifted?: boolean
}

export const MenuItemLink: React.FC<Props> = ({ link, title, Icon, shifted }) => {
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

  return (
    <MenuItem
      sx={sx}
      component={Link}
      to={link}>
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
