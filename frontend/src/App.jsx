import { useState } from 'react'
import { createBrowserRouter } from "react-router-dom";
import SignUp from './components/auth-components/SignUp';
import SignIn from './components/auth-components/SignIn';
import Dashboard from './pages/Dashboard'
import PrivateRoute from './context/PrivateRoute';

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/signin', element: <SignIn /> },
    { path: '/dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute>}

])

function App() {
  
  return (
    <>
    <SignUp />
    </>
  )
}

export default App
