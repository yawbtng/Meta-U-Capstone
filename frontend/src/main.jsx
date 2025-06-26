import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {router} from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthContextProvider>

      <RouterProvider router={router} />

    </AuthContextProvider>

  </StrictMode>,
)
