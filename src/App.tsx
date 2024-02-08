import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import {MainPage} from "./pages/main/main-page";
import {LoginPage} from "./pages/login/login-page";
import {RegisterPage} from "./pages/register/register-page";
import {NotFound} from "./pages/not-found/not-found";

function App() {
  const [count, setCount] = useState(0)

  return (
      <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default App
