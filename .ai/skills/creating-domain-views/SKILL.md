---
name: creating-domain-views
description: Creates domain view components (list-view, detail-view) under app/domains following the "passing the box" convention. Use when extracting inline rendering logic from pages into reusable, presentation-only domain views.
---

# Creating Domain Views

Creates presentation-only view components that render a single domain model object. Views live in `app/domains/{domain-model}/` and are consumed by route pages that own composition (section headings, empty states, wrappers, action buttons).

## Prerequisites

Before starting, gather these inputs:

| Input           | Example                                   | How to determine                                                                             |
| --------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| Domain model    | `finance-daily-sale`                         | Backend model name, hyphenated                                                               |
| Serializer path | `Finance::AdminsDailySaleDetailSerializer` | Backend serializer that shapes the API response                                              |
| View type       | `detail-view`, `list-view`, or `table`    | Detail for single-object display, list for one-item-of-a-collection, table for columnar data |
| Consuming page  | `admin-finance-daily-sale-detail-page.jsx`    | The route page that will import and render this view                                         |

## Workflow

Copy this checklist and track progress:

```
- [ ] Step 1: Read the backend serializer to determine data shape
- [ ] Step 2: Read the backend model for enums and associations
- [ ] Step 3: Classify nested objects (taxonomy vs domain entity)
- [ ] Step 4: Create the view file
- [ ] Step 5: Wire the view into the consuming page
```

### Step 1: Read the backend serializer

Find the serializer that shapes the API response for this model:

**Where to find it:** `carwash-api/app/domains/{context}/{resource}/{actor}_{view_type}_serializer.rb`

The `attributes` call lists scalar fields. `has_one`/`has_many` calls list associations. These determine what the view can render.

### Step 2: Read the backend model for enums

**Where to find it:** `carwash-api/app/domains/{context}/{resource}/model.rb` or the base model file.

Look for `enum` declarations — these map to Badge displays in the view. Note the possible values for status-like fields.

### Step 3: Classify nested objects

Every nested object in the serializer output must be classified:

| Classification                | Definition                           | View rule                                                | Examples                                                                                 |
| ----------------------------- | ------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Taxonomy / reference data** | Static lookup, no own lifecycle page | View can reach inside and render its fields              | `geo_country`, `billing_entitlement`, `taxonomy_category`, `org_company` (when embedded) |
| **Domain entity**             | Has own lifecycle, own CRUD pages    | Page must peel it out and pass to its own view component | `billing_agreement`, `billing_bill_to_profile`, `billing_entitlement_balance`            |

**Key rule:** If you wouldn't give it its own detail page, it's taxonomy. If it has its own CRUD lifecycle, it's a domain entity that needs its own view.

#### Embedded Relationship Rendering

When a taxonomy/reference object is embedded via a `has_one` serializer (e.g., `org_company` inside `billing_account`), it should be rendered as an **Embedded Relationship Section** within the detail view — not just inlined as flat fields. This visually communicates the data relationship:

1. **`Card` as container** — owns border, border-radius, and branded `Card.Header` with `bg-secondary text-white`
2. **Branded header** — `Card.Header` with icon (40×40, `bg-white bg-opacity-10 rounded`) + title. Show the most useful embedded field (e.g., company name) as the title
3. **Parent attributes** — `<ListGroup variant="flush">` inside the Card, one `<ListGroup.Item>` per attribute
4. **Embedded section below** — inside the same Card, render:
   - A plain `<div>` (not a `<ListGroup.Item>`) with `bg-secondary-subtle text-body-secondary` containing: lucide icon + relationship label (e.g., "Company") + `external-link` icon (hints navigability)
   - Another `<ListGroup variant="flush">` for the embedded model's own attributes

**Design reference:** `docs/pencil/billing/finance-daily-sale.pen`

### Step 4: Create the view file

**File:** `app/domains/{domain-model}/{domain-model}-{view-type}.jsx`

Choose the appropriate template:

- **Detail view** (single object, key-value display): See [templates/detail-view.md](templates/detail-view.md)
- **List view** (one item of a collection, wrapperless fragment): See [templates/list-view.md](templates/list-view.md)
- **Table** (array of items, columnar with aligned headers): See [templates/table.md](templates/table.md)

### Step 5: Wire into consuming page

In the route page that currently inlines the rendering logic:

1. Remove the inline section component and any helpers only used by it
2. Import the new domain view
3. Compose: the page owns section headings, empty states, wrappers (Table, ListGroup), and action buttons
4. The view renders only its own model's fields

## "Passing the Box" Rules

These rules govern how data flows from page to view:

1. **Page owns composition** — section headings, empty states, mapping over arrays, wrapper elements (Table, ListGroup, card containers), action buttons
2. **List/detail views receive ONE model object** — never an array, never sibling associations. Table views are the exception: they receive an array and own the full table structure
3. **Taxonomy data stays inside** — the view can access `model.geo_country.name` because `geo_country` is reference data
4. **Domain entities get peeled out** — the page maps over `billing_agreements` and passes each to `<BillingAgreementListView billingAgreement={agreement} />`
5. **No routing, no API calls** — views are passive presentation components
6. **Always wrapperless** — list views are always fragments (`<>...</>`), never wrapped in `<tr>`, `<ListGroup.Item>`, or any container element. The page owns the wrapper and layout. If the page needs tabular layout, the page owns the `<Table>`/`<tr>`/`<td>` structure directly — list views are not the right tool for per-cell rendering

## Rules

### Must do

- Default export with PascalCase component name matching the file
- Prop name is the camelCase model name: `billingAccount`, `billingAgreement`
- Use Bootstrap components and utilities before custom styles
- Use `formatDateTime` from `@/utils/date-time-utils` for dates
- Keep helper functions (formatters, variant maps) co-located in the view file if view-specific
- Move helpers to `@/utils/` if reused across multiple views
- Use verbose iteration names: `balances.map((balance) => ...)`
- JSDoc to describe what the component is used for and data types for each prop
- If creating a "detail view", always ensure `created_at` and `updated_at` are the last two rendered attributes
- Attribute labels must use the full attribute name from the serializer, title-cased. E.g. `created_at` → "Created At", `name` → "Name" (never abbreviate to "Created" or embellish to "Company Name")
- One attribute per row — never nest multiple attributes on a single line, for mobile responsiveness
- Status/boolean attributes get their own row with a `<Badge>`, never combined with other fields
- Use `ListGroup variant="flush"` for all detail view rows — never `<Table>` or `<dl>`. One consistent pattern across all detail views
- Every detail view must include a **Copy toolbar** at the bottom: a `btn-link` button with a `Copy` lucide icon that copies a plain-text representation to the clipboard via `navigator.clipboard.writeText`
- The copy text builder (`copyText`) must live in the domain service file (`{domain-model}-service.js`), not in the view. The output format is: model class name on line 1, then `id` and `uuid` always first, followed by remaining attributes as `key: value` pairs — one per line
- Import `useToast` from `@/hooks/use-toast` to show a success toast after copying

### Must not do

- No API calls or side effects
- No routing logic (Link, navigate, useParams)
- No wrapper elements the consuming page already owns
- No receiving arrays in list/detail views — the page maps and passes individual items (table views are the exception)
- No reaching into sibling domain entities — only the model's own fields and its taxonomy associations

## Canonical examples

| View                      | File                                                                                | Pattern                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Company detail            | `app/domains/org-company/org-company-detail-view.jsx`                               | **Primary reference** — ListGroup flush detail view with copy toolbar, Badge status, domain service for copyText |
| Company service           | `app/domains/org-company/org-company-service.js`                                    | Domain service with `copyText` method for clipboard copy                                                         |
| Account detail            | `app/domains/finance-daily-sale/finance-daily-sale-detail-view.jsx`                       | Detail view with embedded relationship section (org_company), status badge, date formatting                      |
| Agreement list row        | `app/domains/billing-agreement/billing-agreement-list-view.jsx`                     | Wrapperless list view with badge, date range, conditional action                                                 |
| Bill-to profile card      | `app/domains/billing-bill-to-profile/billing-bill-to-profile-list-view.jsx`         | Wrapperless list view with contact details, optional fields                                                      |
| Entitlement balance list  | `app/domains/billing-entitlement-balance/billing-entitlement-balance-list-view.jsx` | Wrapperless list view with labeled numeric values                                                                |
| Entitlement balance table | `app/domains/billing-entitlement-balance/billing-entitlement-balance-table.jsx`     | Table view receiving array, aligned columns, numeric formatting                                                  |
