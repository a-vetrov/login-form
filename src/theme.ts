import {createTheme, ThemeOptions} from '@mui/material/styles'

const defaultTheme = createTheme();

export const getCustomTheme = (): ThemeOptions => {
  return {
    palette: {
      mode: 'dark'
    },
    typography: {
      h1: {
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: '2rem',
        },
      },
      h2: {
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: '2rem',
        },
      },
      h3: {
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: '1.5rem',
        },

      },

    }
  }
}
