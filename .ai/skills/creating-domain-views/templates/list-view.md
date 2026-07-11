# List View Template

Renders ONE item of a collection as a **wrapperless fragment** (`<>...</>`). The consuming page owns the container element (`<ListGroup.Item>`, card `<div>`, etc.) and decides the layout (list, grid, table).

A list view shows a horizontal summary of a domain model — the kind of content you'd see in a `ListGroup.Item` or a row card. It is layout-agnostic: the same view can be placed inside a `ListGroup`, a card grid, or any other container by the page.

## Template

```jsx
import { Badge, Button } from 'react-bootstrap'
import { ExternalLink } from 'lucide-react'

const {ModelName}ListView = ({ {modelProp} }) => (
  <>
    <Badge
      bg="light"
      text="dark"
      className="border fw-medium"
    >
      { {modelProp}.code }
    </Badge>
    <span className="text-body-secondary small flex-fill">
      { {modelProp}.description }
    </span>
    {
      {modelProp}.action_url && (
        <Button
          variant="outline-primary"
          size="sm"
          href={ {modelProp}.action_url }
          target="_blank"
          rel="noopener noreferrer"
          className="hstack gap-1"
        >
          <ExternalLink size={ 13 } />
          { 'View' }
        </Button>
      )
    }
  </>
)

export default {ModelName}ListView
```

## Placeholders

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{ModelName}` | `BillingAgreement` | PascalCase component name |
| `{modelProp}` | `billingAgreement` | camelCase prop name |

## Notes

- Always a fragment (`<>...</>`) — never wraps in `<tr>`, `<ListGroup.Item>`, or any container
- The view renders ONE item, never maps over an array
- The page owns the wrapper and layout direction (hstack, vstack, grid, table)
- If the page needs tabular layout, the page owns `<Table>`, `<tr>`, `<td>` — the list view is not the right tool for per-cell rendering
- Inline labels with values when there are no table headers for context (e.g., "42 available" not just "42")
- Conditional rendering for optional fields: `{ model.field && (...) }`
- Use `'—'` (em dash) for missing/null values
- Taxonomy associations can be reached into: `model.billing_entitlement?.instrument`
- No routing logic (Link, navigate) — the page handles navigation

## Canonical examples

- `app/domains/billing-agreement/billing-agreement-list-view.jsx` — Badge + date range + conditional PDF button
- `app/domains/billing-bill-to-profile/billing-bill-to-profile-list-view.jsx` — Badge + contact details with optional fields
- `app/domains/billing-entitlement-balance/billing-entitlement-balance-list-view.jsx` — Badge + labeled numeric values
