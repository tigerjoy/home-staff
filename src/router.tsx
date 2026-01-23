import { createBrowserRouter } from 'react-router-dom'
import { Providers } from './Providers'
import AuthProtectedRoute from './router/AuthProtectedRoute'
import { AppLayout } from './components/AppLayout'
import { LandingPage } from './pages/LandingPage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthCallback } from './pages/AuthCallback'
import { StaffDirectory } from './pages/StaffDirectory'
import { EmployeeDetail } from './pages/EmployeeDetail'
import { AddEmployee } from './pages/AddEmployee'
import { EditEmployee } from './pages/EditEmployee'
import { Attendance } from './pages/Attendance'
import { Payroll } from './pages/Payroll'
import { Settings } from './pages/Settings'
import { Onboarding } from './pages/Onboarding'
import { EmployeePortal } from './pages/EmployeePortal'
import NotFoundPage from './pages/404Page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Providers />,
    children: [
      // Public routes
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/auth/callback',
        element: <AuthCallback />,
      },
      {
        path: '/portal',
        element: <EmployeePortal />,
      },
      // Auth protected routes
      {
        path: '/',
        element: <AuthProtectedRoute />,
        children: [
          {
            path: '/onboarding',
            element: <Onboarding />,
          },
          {
            element: <AppLayout />,
            children: [
              {
                path: '/staff',
                element: <StaffDirectory />,
              },
              {
                path: '/staff/new',
                element: <AddEmployee />,
              },
              {
                path: '/staff/:id',
                element: <EmployeeDetail />,
              },
              {
                path: '/staff/:id/edit',
                element: <EditEmployee />,
              },
              {
                path: '/attendance',
                element: <Attendance />,
              },
              {
                path: '/payroll',
                element: <Payroll />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
