import { useState } from 'react'
import { createBrowserRouter } from "react-router-dom";
import SignUp from './components/auth-components/SignUp';
import SignIn from './components/auth-components/SignIn';
import Dashboard from './pages/Dashboard'

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/signin', element: <SignIn /> },
    { path: '/dashboard', element: <Dashboard />}

])

function App() {
  
  return (
    <>
    <SignUp />
    </>
  )
}

export default App
