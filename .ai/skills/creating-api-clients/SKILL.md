---
name: creating-api-clients
description: Generates ky-based API client modules under app/api following this repository's conventions for path constants, payload whitelisting, and search param cleaning. Use when creating new admin API endpoints for finance resources or admin sessions.
---

# Creating API Clients

Generates API client modules that connect admin route pages to the Rails backend. Each module exports a plain object with explicit methods (index, show, create, update, destroy) that call the backend via `adminApiClient`.

## Prerequisites

| Input | Example | How to determine |
| ----- | ------- | ---------------- |
| Domain context | `finance` | Backend bounded context |
| Resource name | `daily_sales`, `expenses` | Backend resource (snake_case plural) |
| HTTP methods needed | `index`, `show`, `create`, `update`, `destroy` | Which CRUD actions does the backend expose? |

## Workflow

```
- [ ] Step 1: Determine the API path from backend routes
- [ ] Step 2: Identify payload fields from backend request object
- [ ] Step 3: Identify search params from backend index request
- [ ] Step 4: Create the API client module
- [ ] Step 5: Verify the module is importable from route pages
```

### Step 1: Determine the API path

Find the route in `carwash-api/config/routes/admins_routes.rb`.

Path pattern: `admins/{domain}/{resource}` (e.g., `admins/finance/daily_sales`).

All admin endpoints use `adminApiClient` from `@/api/ky-client`.

### Step 2: Identify payload fields (for create/update)

**Where to find it:** `carwash-api/app/domains/finance/{resource}/admins_create_request.rb` or `admins_update_request.rb`

Map `permitted_params` 1:1 as payload object keys.

### Step 3: Identify search params (for index)

**Where to find it:** `carwash-api/app/domains/finance/{resource}/admins_index_request.rb`

Include `page`, `page_size`, `order_by`, `order_dir` alongside `custom_permitted_params`.

### Step 4: Create the API client module

**File:** `app/api/admin-{domain}-{resource}-api.js`

Choose the appropriate template:

- **Admin read-only** (index + show): [templates/admin-read-only.md](templates/admin-read-only.md)
- **Admin full CRUD**: [templates/admin-full-crud.md](templates/admin-full-crud.md)

### Step 5: Verify importability

```js
import { adminFinanceDailySalesApi } from '@/api/admin-finance-daily-sales-api'
```

## Rules

### Must do

- Use uppercase `SCREAMING_SNAKE_CASE` for path constants
- Whitelist payload fields explicitly
- Use `removeObjectEmptyAttributes` from `@/utils/object-utils` for search params
- Return `.json()` from every method
- Use colon-aligned key spacing
- Add JSDoc to every method

### Must not do

- Do not mutate API response objects in the API module
- Do not embed UI logic, toasts, or navigation in API modules
- Do not accept unbounded arbitrary query params
- Do not place API modules anywhere except `app/api/`

## File naming

| Pattern | Example |
| ------- | ------- |
| `admin-{domain}-{resource}-api.js` | `admin-finance-daily-sales-api.js` |
| `admin-sessions-api.js` | Admin auth (identities) |

## JSDoc convention

- `index` filter object → `filters`
- `create`/`update` payload → singular domain name: `dailySale`, `expense`
- ID params → `{domain}Id`: `dailySaleId`, `expenseId`

```js
/**
 * Fetches paginated daily sales.
 * @param {Object} filters - Filter and pagination params
 * @param {string} [filters.sale_date_from] - Start date filter
 * @returns {Promise<Object>} Daily sales list with meta
 */
index: (filters) => ...
```
