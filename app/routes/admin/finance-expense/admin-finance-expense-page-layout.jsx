import { Outlet, useMatches } from 'react-router'
import { AdminPageShell } from '@/components/navigation/admin-page-shell'
import {
  ADMIN_FINANCE_EXPENSES_PAGE_METADATA,
  ADMIN_FINANCE_EXPENSES_RESOURCE_ACTIONS
} from './admin-finance-expense-navigation'

export const handle = {
  breadcrumb: [
    { label: 'Finance', isClickable: false },
    'Expenses'
  ]
}

export default function AdminFinanceExpensePageLayout() {
  const matches    = useMatches()
  const leafHandle = matches[matches.length - 1]?.handle
  const pageShell  = leafHandle?.pageShell || {}

  return (
    <AdminPageShell
      pageMetadata={ {
        ...ADMIN_FINANCE_EXPENSES_PAGE_METADATA,
        ...pageShell
      } }
      resourceActions={
        pageShell.transformResourceActions
          ? pageShell.transformResourceActions(ADMIN_FINANCE_EXPENSES_RESOURCE_ACTIONS)
          : ADMIN_FINANCE_EXPENSES_RESOURCE_ACTIONS
      }
    >
      <Outlet />
    </AdminPageShell>
  )
}
