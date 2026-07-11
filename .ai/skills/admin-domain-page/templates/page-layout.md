# Page Layout

**Output file:** `app/routes/admin/finance-{model}/admin-finance-{model}-page-layout.jsx`

## Adapt for your resource

- `ADMIN_FINANCE_DAILY_SALES_PAGE_METADATA` / `ADMIN_FINANCE_DAILY_SALES_RESOURCE_ACTIONS` -> your constant names
- `AdminFinanceDailySalePageLayout` -> your component name

## Template

```jsx
import { Outlet, useMatches } from 'react-router'
import { AdminPageShell } from '@/components/navigation/admin-page-shell'
import {
  ADMIN_FINANCE_DAILY_SALES_PAGE_METADATA,
  ADMIN_FINANCE_DAILY_SALES_RESOURCE_ACTIONS
} from './admin-finance-daily-sale-navigation'

export const handle = {
  breadcrumb: [
    { label: 'Finance', isClickable: false },
    'Daily Sales'
  ]
}

export default function AdminFinanceDailySalePageLayout() {
  const matches    = useMatches()
  const leafHandle = matches[matches.length - 1]?.handle
  const pageShell  = leafHandle?.pageShell || {}

  return (
    <AdminPageShell
      pageMetadata={ {
        ...ADMIN_FINANCE_DAILY_SALES_PAGE_METADATA,
        ...pageShell
      } }
      resourceActions={
        pageShell.transformResourceActions
          ? pageShell.transformResourceActions(ADMIN_FINANCE_DAILY_SALES_RESOURCE_ACTIONS)
          : ADMIN_FINANCE_DAILY_SALES_RESOURCE_ACTIONS
      }
    >
      <Outlet />
    </AdminPageShell>
  )
}
```
