# Admin Full CRUD API Client

Use for admin endpoints with index, show, create, update, and destroy.

**Client:** `adminApiClient` (reads `ADMIN_CSRF_TOKEN`, refreshes via admin session)

**Output file:** `app/api/admin-{domain}-{resource}-api.js`

## Adapt for your resource

- Path constant: `ADMIN_FINANCE_DAILY_SALES_PATH`
- Path string: `'admins/finance/daily_sales'`
- Export name: `adminFinanceDailySalesApi`
- Payload fields: from backend `AdminsCreateRequest` / `AdminsUpdateRequest` `permitted_params`

## Template

```js
import { adminApiClient } from '@/api/ky-client'
import { removeObjectEmptyAttributes } from '@/utils/object-utils'

const ADMIN_FINANCE_DAILY_SALES_PATH = 'admins/finance/daily_sales'

export const adminFinanceDailySalesApi = {
  index : (filters) => adminApiClient.get(
    ADMIN_FINANCE_DAILY_SALES_PATH,
    { searchParams: removeObjectEmptyAttributes(filters) }
  ).json(),

  show : (dailySaleId) => adminApiClient.get(
    `${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`
  ).json(),

  create : (dailySale) => {
    const payload = {
      sale_date  : dailySale.sale_date,
      gross_sales: dailySale.gross_sales
      // Whitelist each field from backend create request permitted_params
    }

    return adminApiClient.post(
      ADMIN_FINANCE_DAILY_SALES_PATH,
      { json: payload }
    ).json()
  },

  update : (dailySaleId, dailySale) => {
    const payload = {
      gross_sales: dailySale.gross_sales
      // Whitelist each field from backend update request permitted_params
    }

    return adminApiClient.patch(
      `${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`,
      { json: payload }
    ).json()
  },

  destroy : (dailySaleId) => adminApiClient.delete(
    `${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`
  ).json()
}
```
