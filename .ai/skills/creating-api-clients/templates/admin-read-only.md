# Admin Read-Only API Client

Use for admin endpoints with index + show only (dashboard, reports).

**Client:** `adminApiClient` (reads `ADMIN_CSRF_TOKEN`, refreshes via admin session)

**Output file:** `app/api/admin-{domain}-{resource}-api.js`

## Adapt for your resource

- Path constant: `ADMIN_FINANCE_DASHBOARD_PATH`
- Path string: `'admins/finance/dashboard'`
- Export name: `adminFinanceDashboardApi`

## Template

```js
import { adminApiClient } from '@/api/ky-client'
import { removeObjectEmptyAttributes } from '@/utils/object-utils'

const ADMIN_FINANCE_DASHBOARD_PATH = 'admins/finance/dashboard'

export const adminFinanceDashboardApi = {
  index : (filters) => adminApiClient.get(
    ADMIN_FINANCE_DASHBOARD_PATH,
    { searchParams: removeObjectEmptyAttributes(filters) }
  ).json(),

  show : (id) => adminApiClient.get(
    `${ADMIN_FINANCE_DASHBOARD_PATH}/${id}`
  ).json()
}
```
