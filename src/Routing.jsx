import { Route, Routes } from 'react-router-dom'
import Layout from './commonComponents/layout/Layout'
import NotFound from './pages/notFound/NotFound'
import MainLayout from './commonComponents/layout/MainLayout'
import { useNetwork } from '@mantine/hooks'
import { displayNotification } from './commonComponents/notifications/displayNotification'
import { updatedNotification } from './commonComponents/notifications/updateNotification'
import Dashboard from './pages/dashboard/Dashboard'
import EInvoiceAnalyzer from './pages/EInvocieAnalyzer/EInvoiceAnalyzer'
import Reports from './pages/reports/reports';
import ReportPage from './pages/reports/reportPage';

const Routing = () => {
  const network = useNetwork()

  if (!network.online) {
    displayNotification({
      id: 'offline',
      loading: true,
      title: "You're offline",
      message: 'Oops! You are disconnected from Internet',
      variant: 'error',
      autoClose: false
    })
  } else {
    updatedNotification({
      id: 'offline',
      loading: false,
      title: "You're back online",
      message: 'Hurray! You are connected back to Internet',
      variant: 'success',
      autoClose: true
    })
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='analyze' element={<EInvoiceAnalyzer />} />
          <Route path='reports' element={<Reports />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default Routing
