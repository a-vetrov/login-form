import {createTheme, ThemeOptions} from '@mui/material/styles'

const defaultTheme = createTheme();

export const getCustomTheme = (): ThemeOptions => {
  return {
    palette: {
      mode: 'dark'
    },
    typography: {
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: defaultTheme.typography.pxToRem(32)
        },
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: defaultTheme.typography.pxToRem(24),
        },
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: defaultTheme.typography.pxToRem(20)
        },
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        [defaultTheme.breakpoints.down('md')]: {
          fontSize: defaultTheme.typography.pxToRem(18)
        },
      },

    },
    components: {
      MuiButtonGroup: {
        styleOverrides: {
          grouped: {
            variants: [
              {
                props: {
                  size: 'small',
                },
                style: {
                  [defaultTheme.breakpoints.down('sm')]: {
                    padding: '3px 2px',
                    minWidth: '30px',
                    flexGrow: 1
                  }
                },
              },
            ]
          }
        }
      }
    }
  }
}
