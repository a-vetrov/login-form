import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/main/main-page'
import { LoginPage } from './pages/login/login-page'
import { RegisterPage } from './pages/register/register-page'
import { NotFound } from './pages/not-found/not-found'
import { alpha, createTheme, ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { store } from './store'
import AccountPage from './pages/account/account-page'
import { Box, CssBaseline } from '@mui/material'
import { BrokerListPage } from './pages/broker-list/broker-list-page'
import { BrokerAddPage } from './pages/broker-add/broker-add'
import { PortfolioPage } from './pages/portfolio/portfolio-page'
import { SandboxPage } from './pages/sandbox/sandbox-page'
import { CatalogPage } from './pages/catalog/catalog-page'
import { DetailsPage } from './pages/details/details-page'
import { getCustomTheme } from './theme'

export const App: React.FC = () => {
  const defaultTheme = createTheme(getCustomTheme())

  return (
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <Box
            id="hero"
            sx={{
              width: '100%',
              backgroundImage: `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
              backgroundSize: '100% 20%',
              backgroundRepeat: 'no-repeat'
            }}
          >
          <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/sandbox" element={<SandboxPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/catalog/:category/:id" element={<DetailsPage />} />
              <Route path="/catalog/:category" element={<CatalogPage />} />
              <Route path="/broker/list" element={<BrokerListPage />} />
              <Route path="/broker/add" element={<BrokerAddPage />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
          </Box>
        </ThemeProvider>
      </Provider>
  )
}
