import { useState } from 'react'
import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUp from './components/auth-components/SignUp';
import SignIn from './components/auth-components/SignIn';
import Dashboard from './pages/Dashboard'
import PrivateRoute from './context/PrivateRoute';
import { Outlet } from 'react-router-dom'
import UserProfile from './pages/Settings';
import AddContact from './pages/AddContact';
import AllContacts from './pages/AllContacts';
import { Toaster } from "sonner";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/signup" />, // Redirect to signup as the default
  },
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'signup', element: <SignUp /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'home', element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: 'settings', element: <PrivateRoute><UserProfile /></PrivateRoute> },
      { path: 'add-contact', element: <PrivateRoute><AddContact /></PrivateRoute> },
      { path: 'all-contacts', element: <PrivateRoute><AllContacts /></PrivateRoute> },
    ],
  },
]);

function App() {

  return (
    <>
      <Toaster richColors position="bottom-center" />

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
