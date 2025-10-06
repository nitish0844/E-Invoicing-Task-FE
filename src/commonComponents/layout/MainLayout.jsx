import { Outlet } from 'react-router-dom'
import AppShellLayout from './AppShellLayout'

const MainLayout = () => {
  return (
    <AppShellLayout>
      <Outlet />
    </AppShellLayout>
  )
}

export default MainLayout
