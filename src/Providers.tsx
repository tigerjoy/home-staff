import { Outlet } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'

export function Providers() {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  )
}
