import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUp from './components/auth-components/SignUp';
import SignIn from './components/auth-components/SignIn';
import Dashboard from './pages/Dashboard'
import PrivateRoute from './context/PrivateRoute';
import { Outlet } from 'react-router-dom'
import UserProfile from './pages/Settings';
import AddContact from './pages/AddContact';
import AllContacts from './pages/AllContacts';
// import TestPipeline from './pages/TestPipeline';
import { Toaster } from "sonner";
import AppLayout from './components/layout/AppLayout';

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
      { 
        path: 'home', 
        element: (
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        ) 
      },
      { 
        path: 'settings', 
        element: (
          <PrivateRoute>
            <AppLayout>
              <UserProfile />
            </AppLayout>
          </PrivateRoute>
        ) 
      },
      { 
        path: 'add-contact', 
        element: (
          <PrivateRoute>
            <AppLayout>
              <AddContact />
            </AppLayout>
          </PrivateRoute>
        ) 
      },
      { 
        path: 'all-contacts', 
        element: (
          <PrivateRoute>
            <AppLayout>
              <AllContacts />
            </AppLayout>
          </PrivateRoute>
        ) 
      },
      // { path: 'test-pipeline', element: <PrivateRoute><TestPipeline /></PrivateRoute> },
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster richColors position="bottom-center" />
      <Outlet />
    </>
  )
}

export default App
