# Scorpio Carwash Web — Engineering Instructions

You are working on a React Router v7 (framework mode) SSR application. This is the admin portal for Scorpio Carwash. A Rails API backend (`carwash-api`) serves all data. This document is the single source of truth for code conventions, architecture, and patterns. Follow it exactly.

## Stack

- React 19, JavaScript (`.js`/`.jsx`) — no TypeScript
- React Router v7 (framework mode, SSR enabled via `react-router.config.js`)
- Vite for bundling and HMR
- react-bootstrap v2 + Bootstrap 5 SCSS for UI
- lucide-react for icons
- react-hook-form + zod + @hookform/resolvers for forms and validation
- ky for HTTP requests (configured in `app/api/ky-client.js`)
- sass-embedded for SCSS compilation
- ESLint v9 for linting
- Prettier for formatting

## Business Context

Scorpio Carwash is a car wash business in the Philippines. The admin panel lets a remote admin (in Japan) enter financial data from the physical logbook: daily sales, expenses, bank deposits, other income, and loans.

Target users are non-technical business operators. All user-facing text (error messages, labels, descriptions) must be written in plain, simple language.

Business rules (revenue split, daily closing, currency, dates) live in `carwash-docs/business-rules.md`. Read that file when implementing finance UI logic.

## Product Segment

Carwash v1 has a single frontend segment — the **Admin portal** at `/admin`. This maps to Jod's **Team portal** pattern: private admin-only, separate JWT cookie namespace, dark sidebar layout.

| Segment | URL Namespace | Layout | Auth |
| ------- | ------------- | ------ | ---- |
| Admin Portal | `/admin`, `/admin/finance/**` | `AdminLayout` | Layout loader checks session; login uses `withNoAuth` |

## Architecture Overview

### Directory Structure

```
app/
  api/                                    # API modules (ky-based HTTP clients)
    ky-client.js                          # adminApiClient (CSRF, JWT refresh, retry)
    admin-sessions-api.js
    admin-finance-daily-sales-api.js
    admin-finance-expenses-api.js
    ...
  components/                             # Shared UI components
    breadcrumbs.jsx                       # Route-handle-driven breadcrumbs (useMatches)
    page-loading-indicator.jsx            # Navigation loading spinner
    forms/                                # Reusable RHF-connected field primitives
      text-field.jsx
      select-field.jsx
      date-field.jsx
      ...
    hocs/                                 # Auth guard higher-order components
      with-no-auth.jsx
    navigation/
      admin-page-shell.jsx                # Admin page chrome (header + tabs + content)
    error-display/
      not-found-error.jsx
      general-error.jsx
      api-error-view.jsx
    tables/
      jod-pagination.jsx
  domains/                                # Business logic view components, forms, schemas
    finance-daily-sale/
      finance-daily-sale-constant.js
      finance-daily-sale-schema.js
      finance-daily-sale-form.jsx
      finance-daily-sale-form-fields.jsx
      finance-daily-sale-filter-form.jsx
      finance-daily-sale-list-view.jsx
      finance-daily-sale-detail-view.jsx
    finance-expense/
      ...
  errors/
    api-error.js                          # Typed error class (fromBackendResponse, toResponse)
  hooks/
    use-toast.jsx                         # ToastContext + ToastProvider
    use-modal.jsx                         # ModalContext + ModalProvider
  layouts/                                # Top-level layout wrappers (visual chrome)
    admin/
      admin-layout.jsx                    # Dark sidebar (Offcanvas) + main container
      admin-sidebar.jsx                   # Data-driven sidebar component
      admin-sidebar-config.js             # Sidebar menu config (bounded contexts)
      admin-login-layout.jsx
  routes/                                 # Route page components
    admin/
      admin-login-page.jsx                # /admin/login (standalone, no layout)
      admin-dashboard-home.jsx            # /admin (index)
      finance-layout.jsx                  # Breadcrumb-only Outlet for /admin/finance
      finance-daily-sale/
        admin-finance-daily-sale-navigation.js
        admin-finance-daily-sale-page-layout.jsx
        admin-finance-daily-sale-list-page.jsx
        admin-finance-daily-sale-create-page.jsx
        admin-finance-daily-sale-detail-page.jsx
      ...
  styles/
    main.scss                             # Bootstrap SCSS entry point + custom overrides
    _variables.scss                       # Brand colours, typography, Bootstrap overrides
    _components.scss                      # Custom component styles
  utils/
    constants.js
    search-param-utils.js
    object-utils.js
    error-utils.js
    loader-utils.js
    error-boundary-utils.js
    date-time-utils.js
    currency-utils.js
  root.jsx                                # App root (providers, global loader, error boundary)
  routes.js                               # Master route registry
  admin.routes.js                         # Admin route group
```

### Path Aliases

| Alias | Resolves to |
| ----- | ----------- |
| `@` or `@/` | `app/` |
| `~bootstrap` | `node_modules/bootstrap` |
| `~styles` | `app/styles/` |

---

## Routing Conventions

### Route Registry

All routes are registered in `app/routes.js` using React Router's `route()`, `layout()`, `prefix()`, and `index()` helpers. Admin routes are split into `admin.routes.js`.

```js
// app/routes.js
import { adminRoutes } from './admin.routes.js'

const routes = [
  route('admin/login', './routes/admin/admin-login-page.jsx'),
  route('admin', 'layouts/admin/admin-layout.jsx', adminRoutes),
  route('*', './routes/catch-all-routes.jsx')  // must be last
]
```

### Route Module Exports

Every route page must export:

```jsx
// 1. meta — page title and robots directive
export const meta = () => ([
  { title: 'Daily Sales | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

// 2. handle — breadcrumb and/or pageShell overrides (optional)
export const handle = {
  breadcrumb: 'Daily Sales',
  pageShell: { guidanceText: 'Enter logbook entries for each car wash.' }
}

// 3. Default export — page component
export default AdminFinanceDailySaleListPage
```

All admin pages use `robots: noindex, nofollow`.

---

## Admin Portal Layout Nesting

Admin pages use a three-level layout nesting to eliminate boilerplate:

```
AdminLayout (sidebar + main)
  -> finance-layout.jsx (breadcrumb-only Outlet)
    -> admin-finance-daily-sale-page-layout.jsx (wraps AdminPageShell)
      -> admin-finance-daily-sale-list-page.jsx (content only)
```

### Page Layout Pattern

Each resource group (e.g. `finance-daily-sale`) has a page layout that:
1. Imports `AdminPageShell` and shared navigation constants
2. Uses `useMatches()` to read `handle.pageShell` overrides from the current child route
3. Merges overrides onto defaults and renders `<Outlet />` as children

### Per-Page Overrides via `handle.pageShell`

| Key | Type | Purpose |
| --- | ---- | ------- |
| `guidanceText` | string | Blue info box below the header |
| `title` | string | Override the default page title in the shell header |
| `description` | string | Override the default description |
| `transformResourceActions` | function | Transform the resource action tabs (e.g. change `end` prop) |

### Navigation Constants

Each resource group has a `*-navigation.js` file exporting:

```js
export const ADMIN_FINANCE_DAILY_SALES_PAGE_METADATA = {
  contextLabel    : 'Finance',
  title           : 'Daily Sales',
  description     : 'Enter logbook entries for each car wash.'
}

export const ADMIN_FINANCE_DAILY_SALES_RESOURCE_ACTIONS = [
  { label: 'List',   to: '/admin/finance/daily-sales',        icon: 'list', end: true },
  { label: 'Create', to: '/admin/finance/daily-sales/create', icon: 'plus', end: true }
]
```

### Resource Action Shape

```js
{
  label    : 'List',
  to       : '/admin/finance/daily-sales',
  icon     : 'list',                        // Key: 'list' | 'plus' | 'check-circle'
  end      : true,
  disabled : false,
  badge    : 'Coming soon'
}
```

---

## Auth Boundaries

| Page | Guard |
| ---- | ----- |
| `/admin/login` | `withNoAuth` — blocks logged-in users |
| All other `/admin/**` | Layout loader checks session; 401 → redirect to login |

Admin auth uses `Identities::Admin` via `admin-sessions-api.js` and admin-specific JWT cookies. Use `adminApiClient` (separate CSRF cookie namespace from any future user-facing clients).

```jsx
export default withNoAuth(AdminLoginPage)
```

---

## API Layer

### API Client (`ky-client.js`)

`adminApiClient` is configured with:
- Base URL from `VITE_API_CARWASH_URL`
- 30s timeout, 2 retries on server errors
- `credentials: 'include'` (cookie-based sessions)
- `beforeRequest`: injects `X-CSRF-Token` from `ADMIN_CSRF_TOKEN` cookie
- `afterResponse`: handles 401 with JWT token refresh via `admins/identities/admins/sessions/current`
- `beforeError`: converts HTTP errors to `ApiError` instances

### API Module Pattern

```js
const ADMIN_FINANCE_DAILY_SALES_PATH = 'admins/finance/daily_sales'

export const adminFinanceDailySalesApi = {
  index   : (filters) => adminApiClient.get(ADMIN_FINANCE_DAILY_SALES_PATH, { searchParams: removeObjectEmptyAttributes(filters) }).json(),
  show    : (dailySaleId) => adminApiClient.get(`${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`).json(),
  create  : (dailySale) => adminApiClient.post(ADMIN_FINANCE_DAILY_SALES_PATH, { json: dailySale }).json(),
  update  : (dailySaleId, dailySale) => adminApiClient.patch(`${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`, { json: dailySale }).json(),
  destroy : (dailySaleId) => adminApiClient.delete(`${ADMIN_FINANCE_DAILY_SALES_PATH}/${dailySaleId}`).json()
}
```

### API Call Rules

- API calls are ONLY allowed in:
  - Route page loaders (`clientLoader`)
  - Route page event handlers (form submissions, button clicks)
  - Domain select-search field components (for taxonomy lookups)
- NEVER call APIs from passive view components or utility functions
- Use `removeObjectEmptyAttributes` for filter/query objects
- Whitelist payload and query fields explicitly
- Use uppercase endpoint constants (`*_PATH`)

---

## Domain Components

Domain components live in `app/domains/{domain-model}/` and contain business-logic view components, forms, schemas, and services.

### Domain Folder Naming

```
app/domains/
  finance-daily-sale/
  finance-daily-closing/
  finance-expense/
  finance-bank-deposit/
  finance-other-income/
  finance-loan/
  ...
```

### Domain File Naming

| File | Purpose |
| ---- | ------- |
| `{domain-model}-constant.js` | Enum constants, label maps, status maps |
| `{domain-model}-schema.js` | Zod validation schema |
| `{domain-model}-form.jsx` | Domain form (`react-hook-form` + `FormProvider`) |
| `{domain-model}-form-fields.jsx` | Form field layout (large forms only) |
| `{domain-model}-list-view.jsx` | List item / table row display |
| `{domain-model}-detail-view.jsx` | Detail display |
| `{domain-model}-filter-form.jsx` | Filter/search form |

### Domain View Rules

- Domain views receive a domain model object as a prop
- Prop names reflect the model: `dailySale`, `expense`, `loan`
- Domain views are passive — no API calls, no side effects
- Use Bootstrap components/utilities before custom styles

---

## Forms and Validation

### Required Stack

- `react-hook-form` for form state management
- `zod` for schema validation
- `@hookform/resolvers` for zod integration
- `FormProvider` for nested field components

### Form Pattern

```jsx
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { financeDailySaleSchema } from './finance-daily-sale-schema'

const FinanceDailySaleForm = ({ onSubmit, defaultValues }) => {
  const methods = useForm({
    resolver      : zodResolver(financeDailySaleSchema),
    defaultValues : defaultValues
  })

  return (
    <FormProvider { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) }>
        <FinanceDailySaleFormFields />
        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  )
}
```

### Form Rules

- Domain forms: `app/domains/{domain-model}/{domain-model}-form.jsx`
- Schemas: `app/domains/{domain-model}/{domain-model}-schema.js`
- Use `FormProvider` and reusable fields from `app/components/forms/**`
- Keep fields inline in the form file by default; split to `*-form-fields.jsx` only for large multi-Card forms

### Date and Currency

| Concern | Rule |
| ------- | ---- |
| Civil dates | `YYYY-MM-DD` wire format; `DateField` in forms |
| Timezone | `Asia/Manila` for business dates |
| Currency | `currency-utils.js` — format as `₱1,234.56` |
| 60/40 preview | Client computes read-only shares in daily sale form |

- `DateField` is timezone-independent — convert in the submit handler via `DateTimeUtils.toApiString(value, { timezone })`
- Use the entity's timezone (`Asia/Manila`), never hardcode inline locale strings

---

## Error Handling

| Utility | File | Purpose |
| ------- | ---- | ------- |
| `getApiErrorToastConfig(error)` | `utils/error-utils.js` | Returns toast config for API errors |
| `setApiErrorsToFormFields(error, setError)` | `utils/error-utils.js` | Maps 422 field errors to RHF field errors |
| `handleLoaderError(error, fallback)` | `utils/loader-utils.js` | Standard loader error handler (re-throws 401) |

### Loader Error Pattern

```jsx
export async function clientLoader({ request }) {
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

### Submit Error Pattern

```jsx
const handleSubmit = async (values) => {
  try {
    await adminFinanceDailySalesApi.create(values)
    showToast({ message: 'Daily sale created', type: 'success' })
    navigate('/admin/finance/daily-sales')
  } catch (error) {
    const toastConfig = getApiErrorToastConfig(error)
    showToast(toastConfig)
    setApiErrorsToFormFields(error, setError)
  }
}
```

---

## State Management

No external state library. State is managed through:

| Mechanism | Purpose |
| --------- | ------- |
| `ToastContext` (`use-toast.jsx`) | Toast notification queue |
| `ModalContext` (`use-modal.jsx`) | Modal stack |
| `useSearchParams` | URL params as source of truth for list state |
| React Router `clientLoader` | Server data loading |
| `useState` | Local UI state |

---

## Search / Filter / Pagination

- URL params are the source of truth for list page state
- Use `useSearchParams` from `react-router`
- Reset `page` to `1` when filters change
- Use `prepareSearchParams` / `serializeUrlParams` from `utils/search-param-utils.js`
- Remove empty params from URL using `removeObjectEmptyAttributes`
- Pagination reads `meta` from API response (`meta.page`, `meta.last`, `meta.count`)
- Use `JodPagination` from `@/components/tables/jod-pagination`

---

## Styling

### Bootstrap-First

- Use Bootstrap utility classes and components wherever possible
- Only add custom CSS/SCSS when Bootstrap is insufficient
- Custom component styles go in `app/styles/_components.scss`
- Brand colours defined in `app/styles/_variables.scss`

### Admin Portal Specific Styles

- `.bg-gradient-chrome` — dark header with wave texture (used in AdminPageShell)
- `.resource-shell-title-card` — frosted glass card (backdrop blur)
- `.resource-shell-guidance` — callout box with left primary border
- `.admin-sidebar` — dark mode sidebar colour adjustments

---

## Breadcrumbs

Driven by `handle.breadcrumb` exports on route modules. `Breadcrumbs` component reads them via `useMatches()`.

```jsx
export const handle = { breadcrumb: 'Daily Sales' }
export const handle = { breadcrumb: { label: 'Finance', isClickable: false } }
export const handle = { breadcrumb: ({ params }) => params.dailySaleId }
```

---

## Code Style Rules

### General

- 2-space indentation
- No semicolons
- Single quotes
- No trailing commas
- Unix linebreaks (`\n`)

### JavaScript Conventions

- Arrow function parens always: `(x) => x`
- Use verbose names in iterations: `dailySales.map((dailySale) => ...)`
- Key spacing is colon-aligned
- JSX curly braces have spaces: `{ value }`
- No PropTypes

### JSX Formatting

- Wrap plain text in curly brackets with single quotes: `{ 'Daily Sales' }`
- Prefer new line for JSX content
- One line per prop when more than 1 prop
- Curly brackets on their own line for ternaries

### Import Order

1. Builtin modules
2. External packages
3. Internal imports (`@/components/...`, `@/hooks/...`)
4. Parent imports (`../`)
5. Sibling imports (`./`)

### Naming Conventions

- **Route page files:** `admin-finance-{model}-{type}-page.jsx`
- **Route page components:** `AdminFinanceDailySaleListPage`
- **Domain folders:** `finance-daily-sale/`, `finance-expense/`
- **Constants:** SCREAMING_SNAKE_CASE: `ADMIN_FINANCE_DAILY_SALES_PAGE_METADATA`
- **API modules:** `admin-{domain}-{resource}-api.js`: `admin-finance-daily-sales-api.js`
- **Boolean variables:** `is` prefix: `isActive`, `isLoggedIn`, `isDisabled`

---

## Anti-Patterns (NEVER Do These)

1. **NEVER call APIs from passive view components** — only in route loaders, handlers, and select-search fields
2. **NEVER mutate backend domain response objects** — keep them as pass-through data
3. **NEVER add custom CSS when Bootstrap utilities suffice** — Bootstrap-first always
4. **NEVER use TypeScript** — this project is JavaScript only (`.js`/`.jsx`)
5. **NEVER put domain forms or schemas in `app/components/`** — they belong in `app/domains/{domain-model}/`
6. **NEVER put domain models or views in `app/routes/`** — route files are pages, domain logic lives in `app/domains/`
7. **NEVER import `AdminPageShell` directly in page components** — it is owned by the page layout
8. **NEVER skip `meta` export on route pages** — every page needs a title and robots directive
9. **NEVER put layout components with visual chrome in `app/routes/`** — they belong in `app/layouts/`
10. **NEVER read `VITE_*` variables with `process.env`** — use `import.meta.env`
11. **NEVER store filter state only in component state** — use URL params as source of truth
12. **NEVER use Tailwind** — use Bootstrap SCSS

---

## Commands

```bash
# Run dev server (Vite HMR)
npm run dev

# Build for production (SSR bundle)
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint:fix
```
