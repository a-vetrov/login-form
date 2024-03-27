import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/main/main-page'
import { LoginPage } from './pages/login/login-page'
import { RegisterPage } from './pages/register/register-page'
import { NotFound } from './pages/not-found/not-found'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { store } from './store'
import AccountPage from './pages/account/account-page.tsx'
import { CssBaseline } from '@mui/material'
import { BrokerListPage } from './pages/broker-list/broker-list-page'
import { BrokerAddPage } from './pages/broker-add/broker-add.tsx'
import { PortfolioPage } from './pages/portfolio/portfolio-page.tsx'
import { SandboxPage } from './pages/sandbox/sandbox-page.tsx'

export const App: React.FC = () => {
  const defaultTheme = createTheme()

  return (
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/sandbox" element={<SandboxPage />} />
              <Route path="/broker/list" element={<BrokerListPage />} />
              <Route path="/broker/add" element={<BrokerAddPage />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </Provider>
  )
}
