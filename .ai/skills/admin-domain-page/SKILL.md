---
name: admin-domain-page
description: Scaffolds a complete admin portal domain page with list, create, detail, search, and pagination. Use when asked to create a new admin page, add a finance resource to the admin portal, or scaffold admin CRUD pages for a resource.
---

# Creating Admin Domain Pages

Scaffolds all files needed to add a new domain resource to the admin portal: sidebar link, routes, page layout, navigation constants, API client, list page with search/pagination, filter form, create page, and detail page.

## Prerequisites

Before starting, gather these inputs from the user or infer from context:

| Input | Example | Source |
| ----- | ------- | ------ |
| Bounded context | `finance` | Sidebar group the resource belongs to |
| Resource name (plural) | `daily-sales` | URL segment (kebab-case) |
| Resource name (singular) | `dailySale` | Variable names and labels |
| Resource model | `Finance::DailySale` | Backend model class |
| Route param name | `dailySaleId` | URL param for detail page |
| API path segment | `daily_sales` | Backend route (snake_case) |

## Workflow

Copy this checklist and track progress:

```
- [ ] Step 1: Determine searchable fields from backend
- [ ] Step 2: Determine visible fields from backend serializer
- [ ] Step 3: Create/update sidebar config
- [ ] Step 4: Create API client module
- [ ] Step 5: Create navigation constants
- [ ] Step 6: Create page layout
- [ ] Step 7: Create filter form (domain component)
- [ ] Step 8: Create list page
- [ ] Step 9: Create create page (if resource supports create)
- [ ] Step 10: Create detail page
- [ ] Step 11: Register routes
```

### Step 1: Determine searchable fields

Read the backend `AdminsIndexRequest` class to find `custom_permitted_params`.

**Where to find it:** `carwash-api/app/domains/finance/{resource_plural}/admins_index_request.rb`

### Step 2: Determine visible fields

Read the backend serializer:

**Where to find it:** `carwash-api/app/domains/finance/admins_{resource_singular}_base_serializer.rb`

### Step 3: Create/update sidebar config

**File:** `app/layouts/admin/admin-sidebar-config.js`

```js
{
  label       : 'Daily Sales',
  path        : '/admin/finance/daily-sales',
  activeMatch : /^\/admin\/finance\/daily-sales(\/|$)/,
  isDisabled  : false
}
```

### Step 4: Create API client module

Use the `creating-api-clients` skill:
- Use `adminApiClient`
- Use **admin-full-crud** or **admin-read-only** template
- File: `app/api/admin-finance-{resource}-api.js`
- Path: `admins/finance/{resource_snake}`

### Step 5: Create navigation constants

**File:** `app/routes/admin/finance-{model}/admin-finance-{model}-navigation.js`

See [templates/navigation.md](templates/navigation.md).

### Step 6: Create page layout

**File:** `app/routes/admin/finance-{model}/admin-finance-{model}-page-layout.jsx`

See [templates/page-layout.md](templates/page-layout.md).

### Step 7: Create filter form

**File:** `app/domains/finance-{model}/finance-{model}-filter-form.jsx`

See [templates/filter-form.md](templates/filter-form.md).

### Step 8: Create list page

Use the `creating-route-pages` skill with **admin-list-page** template.

Admin-specific reminders:
- Use `<Table>` from react-bootstrap
- Search section: ghost container (`border rounded-3 p-3 mb-3`) above the table
- Pagination: `JodPagination` from `@/components/tables/jod-pagination`
- Empty state: `<Alert variant="light" className="border mb-0">`

### Step 9: Create create page

Use the `creating-domain-forms` skill for form + schema, then wire in a route page with submit handler.

### Step 10: Create detail page

Use the `creating-route-pages` skill with **admin-detail-page** template.

### Step 11: Register routes

Add the route group in `app/admin.routes.js`:

```js
route('finance/daily-sales', './routes/admin/finance-daily-sale/admin-finance-daily-sale-page-layout.jsx', [
  index('./routes/admin/finance-daily-sale/admin-finance-daily-sale-list-page.jsx'),
  route('create', './routes/admin/finance-daily-sale/admin-finance-daily-sale-create-page.jsx'),
  route(':dailySaleId', './routes/admin/finance-daily-sale/admin-finance-daily-sale-detail-page.jsx')
])
```

For dashboard and report pages (no CRUD scaffold), use the `creating-route-pages` skill directly.
