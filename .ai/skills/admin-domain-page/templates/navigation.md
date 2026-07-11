# Navigation Constants

**Output file:** `app/routes/admin/finance-{model}/admin-finance-{model}-navigation.js`

## Adapt for your resource

- `ADMIN_FINANCE_DAILY_SALES` -> your `ADMIN_FINANCE_{RESOURCE}`
- `'/admin/finance/daily-sales'` -> your route path
- `'Finance'` -> your context label
- `'Daily Sales'` -> your resource title

## Template

```js
export const ADMIN_FINANCE_DAILY_SALES_RESOURCE_ACTIONS = [
  { label: 'List',   to: '/admin/finance/daily-sales',        icon: 'list', end: true },
  { label: 'Create', to: '/admin/finance/daily-sales/create', icon: 'plus', end: true }
]

export const ADMIN_FINANCE_DAILY_SALES_PAGE_METADATA = {
  contextLabel    : 'Finance',
  contextHelpText : 'Track daily sales, expenses, and financial records.',
  title           : 'Daily Sales',
  description     : 'Enter logbook entries for each car wash.'
}
```
