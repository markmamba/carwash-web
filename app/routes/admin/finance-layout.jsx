import { Outlet } from 'react-router'
import Breadcrumbs from '@/components/breadcrumbs'

export default function FinanceLayout() {
  return (
    <>
      <Breadcrumbs />
      <Outlet />
    </>
  )
}
