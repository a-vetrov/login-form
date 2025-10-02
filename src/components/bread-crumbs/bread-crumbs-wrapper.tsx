import React from 'react'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { type BreadCrumbsItem } from '../../types/bread-crumbs.ts'

interface Props {
  items: BreadCrumbsItem[]
}
export const BreadCrumbsWrapper: React.FC<Props> = ({ items }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item) => {
        if (item.to) {
          return (
            <Link underline="hover" color="inherit" to={item.to} component={RouterLink} key={item.label}>
              {item.label}
            </Link>
          )
        } else {
          return (
            <Typography sx={{ color: 'text.primary' }} key={item.label}>{item.label}</Typography>
          )
        }
      })}
    </Breadcrumbs>
  )
}
