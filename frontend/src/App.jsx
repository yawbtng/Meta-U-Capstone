import { useState } from 'react'
import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUp from './components/auth-components/SignUp';
import SignIn from './components/auth-components/SignIn';
import Dashboard from './pages/Dashboard'
import PrivateRoute from './context/PrivateRoute';
import { Outlet } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/signup" />, // Redirect to signup
  },
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'home', element: <PrivateRoute><Dashboard /></PrivateRoute> },
    ],
  },
]);

function App() {

  return (
    <>
      <header>
    <h1 className="text-center text-xl ">Lynk!</h1>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>

      </footer>

    </>
  )
}

export default App
