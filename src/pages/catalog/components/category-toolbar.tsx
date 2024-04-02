import React from 'react'
import {Chip, NoSsr, Stack} from '@mui/material'
import { Link, NavLink } from 'react-router-dom'

const categoriesList = [
  {
    title: 'Акции',
    link: '/catalog/stocks'
  },
  {
    title: 'Облигации',
    link: '/catalog/bonds'
  }
]

export const CategoryToolbar: React.FC = () => {
  return (
    <NoSsr>
      <Stack marginTop={2} marginBottom={2} direction="row" spacing={2}>
        {categoriesList.map((item) => (
          <NavLink to={item.link} key={item.title}>
            {({ isActive }) => (
              <Chip
                label={item.title}
                clickable
                variant={isActive ? 'outlined' : 'filled'}
              />
            )}
          </NavLink>
        ))}
      </Stack>
    </NoSsr>
  )
}
