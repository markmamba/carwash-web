# Detail View Template

Renders a single domain model as a key-value list. Used for the primary object on a detail page.

All detail views use `Card` > `ListGroup variant="flush"` — the idiomatic Bootstrap pattern for bordered key-value rows inside a container. Each `ListGroup.Item` contains a label `<div>` and value `<div>` stacked inside.

- **Card** owns the container: border, border-radius, and branded header (`Card.Header`)
- **ListGroup variant="flush"** provides the attribute rows with built-in padding and borders
- **Embedded sections** sit between ListGroups inside the same Card (a `<div>` divider + another `ListGroup variant="flush"`)

## Template

```jsx
import { Badge, Card, ListGroup } from 'react-bootstrap'
import { Copy } from 'lucide-react'
import { formatDateTime } from '@/utils/date-time-utils'
import { useToast } from '@/hooks/use-toast'
import { {ModelName}Service } from '@/domains/{domain-model}/{domain-model}-service'

// --- View-specific helpers (co-located) ---

const STATUS_VARIANTS = {
  active    : 'success',
  inactive  : 'secondary',
  suspended : 'warning'
}

const DATE_ONLY_FORMAT = {
  day      : '2-digit',
  month    : 'short',
  year     : 'numeric',
  timeZone : 'Asia/Singapore'
}

const formatDateShort = (date) => {
  if (!date) return '—'
  return formatDateTime(date, 'en-SG', { ...DATE_ONLY_FORMAT })
}

// --- Component ---

const {ModelName}DetailView = ({ {modelProp} }) => {
  const { showToast } = useToast()

  const statusVariant = STATUS_VARIANTS[{modelProp}.status] || 'secondary'

  const handleCopy = () => {
    navigator.clipboard.writeText({ModelName}Service.copyText({modelProp})).then(() => {
      showToast({ message: 'Copied to clipboard!', type: 'success' })
    })
  }

  return (
    <Card>
      <Card.Header className="hstack gap-2 bg-secondary text-white">
        {/* Icon + title — surfaces the most useful field as context */}
        <div className="d-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded"
             style={{ width: 40, height: 40 }}>
          <WalletCards size={ 24 } className="text-white" />
        </div>
        <div>
          <div className="fw-semibold">
            { {modelProp}.org_company?.name || '{ModelDisplayName}' }
          </div>
          <div className="small text-white text-opacity-50">
            { '{ModelDisplayName}' }
          </div>
        </div>
      </Card.Header>

      <ListGroup variant="flush">
        {/* Status/boolean fields get their own row with a Badge */}
        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">{ 'Status' }</div>
          <div>
            <Badge
              bg={ statusVariant }
              className="text-capitalize"
            >
              { {modelProp}.status }
            </Badge>
          </div>
        </ListGroup.Item>

        {/* Scalar attributes — one per row */}
        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">{ 'Field Label' }</div>
          <div>{ {modelProp}.field_name || '—' }</div>
        </ListGroup.Item>

        {/* Taxonomy lookups are allowed inside the view */}
        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">{ 'Country' }</div>
          <div>{ {modelProp}.country?.name || '—' }</div>
        </ListGroup.Item>

        {/* Dates — always last two rows */}
        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">{ 'Created At' }</div>
          <div>{ formatDateShort({modelProp}.created_at) }</div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">{ 'Updated At' }</div>
          <div>{ formatDateShort({modelProp}.updated_at) }</div>
        </ListGroup.Item>

        {/* Copy toolbar — always at the bottom */}
        <ListGroup.Item className="text-center">
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none p-0"
            onClick={ handleCopy }
          >
            <Copy
              size={ 13 }
              className="me-1"
            />
            { 'Copy' }
          </button>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default {ModelName}DetailView
```

## Domain Service Template

The `copyText` function lives in the domain service file, not in the view:

**File:** `app/domains/{domain-model}/{domain-model}-service.js`

```js
const {ModelName}Service = {
  /**
   * Builds a plain-text representation of a {RubyClassName} for clipboard copy.
   * id and uuid are always placed at the top.
   *
   * @param {object} {modelProp} - A single object from the API
   * @returns {string}
   */
  copyText: ({modelProp}) => {
    const lines = [
      '{RubyClassName}',
      `id: ${ {modelProp}.id}`,
      `uuid: ${ {modelProp}.uuid || '—'}`,
      // ... remaining attributes in serializer order ...
      `created_at: ${ {modelProp}.created_at || '—'}`,
      `updated_at: ${ {modelProp}.updated_at || '—'}`
    ]
    return lines.join('\n')
  }
}

export { {ModelName}Service }
```

### Copy text output format

When pasted, the output looks like:

```
Org::Company
id: 42
uuid: a3f8c1d2-9e4b-4a7f-b6c8-1d2e3f4a5b6c
name: Acme Holdings Pte Ltd
is_enabled: true
email: hello@acmeholdings.com
...
```

Rules for copy text:
- Line 1 is always the Ruby class name (e.g., `Org::Company`, `Billing::Account`)
- `id` and `uuid` are always the first two attributes
- Remaining attributes follow serializer order
- Use `'—'` for null/missing values

## Placeholders

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{ModelName}` | `OrgCompany` | PascalCase component/service name |
| `{modelProp}` | `orgCompany` | camelCase prop name |
| `{domain-model}` | `org-company` | Hyphenated directory/file name |
| `{RubyClassName}` | `Org::Company` | Ruby model class name for copy output |

## Attribute label naming

Labels must match the full attribute name from the serializer, title-cased:

| Attribute | Good | Bad |
|-----------|------|-----|
| `created_at` | Created At | Created |
| `name` | Name | Company Name |
| `is_enabled` | Is Enabled | Status / Enabled |
| `primary_address` | Primary Address | Address |
| `registration_no` | Registration No | Reg No |

## Notes

- All detail views use `Card` > `ListGroup variant="flush"` — the idiomatic Bootstrap pattern
- `Card` owns the container (border, border-radius, header). `ListGroup variant="flush"` provides the rows (padding, borders for free)
- One attribute per row — never combine multiple attributes on one line (mobile responsiveness)
- Status/boolean fields get their own `<ListGroup.Item>` with a `<Badge>`, same as any other attribute row
- Copy toolbar sits in the last `<ListGroup.Item>` with `text-center`
- Use `'—'` (em dash) for missing/null values
- Taxonomy associations (geo_country, address_geo_area) can be accessed inside the view
- The `useToast` hook is the only side effect allowed (for copy feedback)

## Embedded Relationship Section

When the serializer includes an embedded `has_one` association (e.g., `org_company`), render it within the same `<Card>`. The embedded section sits after the main `ListGroup` as a divider `<div>` + another `ListGroup variant="flush"`.

### Structure

```jsx
<Card>
  <Card.Header className="hstack gap-2 bg-secondary text-white">
    {/* Branded header with icon + title */}
    <div className="d-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded"
         style={{ width: 40, height: 40 }}>
      <WalletCards size={ 24 } className="text-white" />
    </div>
    <div>
      <div className="fw-semibold">
        { {modelProp}.org_company?.name || '{ModelDisplayName}' }
      </div>
      <div className="small text-white text-opacity-50">
        { '{ModelDisplayName}' }
      </div>
    </div>
  </Card.Header>

  <ListGroup variant="flush">
    <ListGroup.Item>
      <div className="text-body-secondary fw-medium small">{ 'Status' }</div>
      <div>
        <Badge bg={ statusVariant } className="text-capitalize">
          { {modelProp}.status }
        </Badge>
      </div>
    </ListGroup.Item>
    {/* ... more rows ... */}
  </ListGroup>

  {/* Embedded relationship section — inside the SAME Card */}
  {
    {modelProp}.org_company && (
      <>
        <div className="hstack gap-2 fw-semibold bg-secondary-subtle text-body-secondary py-2 px-3">
          <Briefcase size={ 18 } />
          { 'Company' }
          <div className="flex-fill" />
          <ExternalLink size={ 18 } className="text-primary" />
        </div>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <div className="text-body-secondary small fw-medium">{ 'Name' }</div>
            <div className="fw-medium">{ {modelProp}.org_company.name }</div>
          </ListGroup.Item>
        </ListGroup>
      </>
    )
  }
</Card>
```

### Key points

- **`Card` as container** — owns border, border-radius, and branded `Card.Header` with `bg-secondary text-white`
- **`ListGroup variant="flush"`** inside the Card — rows get padding and borders for free from Bootstrap
- **Branded header** uses `Card.Header` with `bg-secondary text-white`. Icon wrap is `40x40` with `bg-white bg-opacity-10 rounded`, icon is `size={ 24 }`. Surfaces the most useful embedded field (e.g., company name) as the title
- **Embedded section divider** is a plain `<div>` with `bg-secondary-subtle text-body-secondary` — not a `<ListGroup.Item>` (it's a section heading, not a list item). Contains icon (`size={ 18 }`) + label + `external-link` icon (hints navigability)
- **Embedded rows** use a separate `<ListGroup variant="flush">` after the divider — this is fine since they're siblings inside the Card, not nested ListGroups
- **Design reference**: `docs/pencil/billing/finance-daily-sale.pen`

## Canonical examples

| File | Pattern |
|------|---------|
| `app/domains/finance-daily-sale/finance-daily-sale-detail-view.jsx` | **Primary reference** — Card with branded header, flush ListGroup rows, embedded relationship section |
| `app/domains/org-company/org-company-detail-view.jsx` | Standalone Card with flush ListGroup, copy toolbar, domain service |
| `app/domains/org-company/org-company-service.js` | Domain service with `copyText` for clipboard |
