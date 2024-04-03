import React from 'react'
import {Chip, NoSsr, Stack} from '@mui/material'
import { Link } from 'react-router-dom'
import {CatalogCategoryName, categoriesList} from "../utils/category-list.ts";

interface Props {
  value: CatalogCategoryName
}

export const CategoryToolbar: React.FC<Props> = ({value}) => {
  return (
    <NoSsr>
      <Stack marginTop={2} marginBottom={2} direction="row" spacing={2}>
        {categoriesList.map((item) => (
          <Link to={item.link} key={item.title}>
              <Chip
                label={item.title}
                clickable
                variant={value === item.name ? 'outlined' : 'filled'}
              />
          </Link>
        ))}
      </Stack>
    </NoSsr>
  )
}
