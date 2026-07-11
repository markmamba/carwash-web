---
name: creating-route-pages
description: Creates admin route page modules with clientLoader data loading, meta exports, submit/error flows, and search/filter/pagination. Use when adding dashboard, report, login, or CRUD pages to the admin portal.
---

# Creating Route Pages

Creates complete admin route page modules: data loading via `clientLoader`, meta exports, `handle.pageShell` overrides, submit handlers, error mapping, and URL-driven search/filter/pagination.

## Prerequisites

| Input | Example | How to determine |
| ----- | ------- | ---------------- |
| Page type | `list`, `detail`, `create`, `dashboard`, `report` | What does the page display or do? |
| Route path | `/admin/finance/daily-sales` | URL the user visits |
| API module | `adminFinanceDailySalesApi` | Which API client fetches data? |
| Auth HOC | `withNoAuth` (login only) or none (layout handles auth) | See decision tree |

## Page type decision tree

| Condition | Loader | Auth HOC | Robots | Template |
| --------- | ------ | -------- | ------ | -------- |
| Admin list page | `clientLoader` | None (layout handles auth) | `noindex, nofollow` | [admin-list-page](templates/admin-list-page.md) |
| Admin detail page | `clientLoader` | None | `noindex, nofollow` | [admin-detail-page](templates/admin-detail-page.md) |
| Admin create/edit page | `clientLoader` or none | None | `noindex, nofollow` | Form page + submit handler |
| Dashboard / report page | `clientLoader` | None | `noindex, nofollow` | Custom content page |
| Login page | none | `withNoAuth` | `noindex, nofollow` | Simple form page |

## Workflow

```
- [ ] Step 1: Identify page type (decision tree above)
- [ ] Step 2: Create the route page file
- [ ] Step 3: Add clientLoader
- [ ] Step 4: Add meta export (title + robots)
- [ ] Step 5: Add handle export (breadcrumb, pageShell)
- [ ] Step 6: Add submit handlers (create/edit pages only)
- [ ] Step 7: Add search/filter/pagination (list pages only)
- [ ] Step 8: Register route in admin.routes.js
```

### Step 2: Create the route page file

**File patterns:**

| Page type | File pattern | Example |
| --------- | ------------ | ------- |
| Finance CRUD | `app/routes/admin/finance-{model}/admin-finance-{model}-{type}-page.jsx` | `admin-finance-daily-sale-list-page.jsx` |
| Dashboard | `app/routes/admin/admin-dashboard-home.jsx` | — |
| Login | `app/routes/admin/admin-login-page.jsx` | — |
| Report | `app/routes/admin/admin-finance-{report}-report-page.jsx` | `admin-finance-weekly-report-page.jsx` |

For full CRUD resource scaffolds, prefer the `admin-domain-page` skill.

### Step 3: Add clientLoader

All admin pages use `clientLoader` (no SSR cookie passthrough needed — browser handles cookies):

```js
export async function clientLoader({ request, params }) {
  try {
    const url    = new URL(request.url)
    const params = Object.fromEntries(url.searchParams)
    const data   = await adminFinanceDailySalesApi.index(params)
    return { dailySales: data.daily_sales, meta: data.meta }
  } catch (error) {
    return handleLoaderError(error, { dailySales: [], meta: { last: 1 } })
  }
}
```

`handleLoaderError` re-throws 401 so the layout can redirect to login.

### Step 4: Add meta export

```js
export const meta = () => ([
  { title: 'Daily Sales | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])
```

### Step 5: Add handle export

```js
export const handle = {
  breadcrumb: 'Daily Sales',
  pageShell: {
    guidanceText: 'Enter logbook entries for each car wash.'
  }
}
```

### Step 6: Submit handlers (create/edit)

See [templates/submit-error-flow.md](templates/submit-error-flow.md).

### Step 7: Search/filter/pagination (list pages)

- URL params via `useSearchParams`
- Reset `page` to `1` on filter change
- `JodPagination` for page navigation
- Filter form in ghost container above table

### Step 8: Register route

Add to `app/admin.routes.js`. Login is registered in `app/routes.js` directly (outside layout).

```js
// app/admin.routes.js
import { route, index } from '@react-router/dev/routes'

export const adminRoutes = [
  index('./routes/admin/admin-dashboard-home.jsx'),
  route('finance/daily-sales', './routes/admin/finance-daily-sale/admin-finance-daily-sale-page-layout.jsx', [
    index('./routes/admin/finance-daily-sale/admin-finance-daily-sale-list-page.jsx'),
    route('create', './routes/admin/finance-daily-sale/admin-finance-daily-sale-create-page.jsx'),
    route(':dailySaleId', './routes/admin/finance-daily-sale/admin-finance-daily-sale-detail-page.jsx')
  ])
]
```

## Rules

- Every page exports `meta`
- Finance CRUD pages export `handle.pageShell` overrides (not import `AdminPageShell` directly)
- Login page uses `withNoAuth` at default export
- All other pages rely on layout auth — no auth HOC needed
- API calls only in `clientLoader` and event handlers
