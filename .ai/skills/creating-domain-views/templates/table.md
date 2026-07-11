# Table Template

Renders an **array** of domain model items in a `<Table>` with aligned columns. Use when the data is inherently columnar and cross-row alignment matters (numeric values, dates, statuses).

Unlike list views (which render ONE item as a wrapperless fragment), a table component owns the full table structure — `<Table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>` — because column alignment is intrinsic to the table and cannot be separated.

## Template

```jsx
import { Badge, Table } from 'react-bootstrap'

const {ModelName}Table = ({ {modelPropPlural} }) => (
  <Table
    className="mb-0 align-middle"
    bordered
    responsive
    striped
  >
    <thead>
      <tr>
        <th className="bg-light">
          { 'Label Column' }
        </th>
        <th
          className="bg-light"
          style={{ width: 100 }}
        >
          { 'Short Column' }
        </th>
        <th
          className="bg-light text-end"
          style={{ width: 120 }}
        >
          { 'Numeric Column' }
        </th>
      </tr>
    </thead>
    <tbody>
      {
        {modelPropPlural}.map(({modelPropSingular}) => (
          <tr key={ {modelPropSingular}.id }>
            <td>
              <Badge
                bg="info-subtle"
                text="info-emphasis"
                className="fw-semibold"
              >
                { {modelPropSingular}.taxonomy_field?.label }
              </Badge>
            </td>
            <td className="text-body-secondary">
              { {modelPropSingular}.field_name }
            </td>
            <td className="text-end fw-semibold">
              { {modelPropSingular}.numeric_field?.toLocaleString() ?? '—' }
            </td>
          </tr>
        ))
      }
    </tbody>
  </Table>
)

export default {ModelName}Table
```

## Placeholders

| Placeholder           | Example                      | Description                                |
| --------------------- | ---------------------------- | ------------------------------------------ |
| `{ModelName}`         | `BillingEntitlementBalance`  | PascalCase component name                  |
| `{modelPropPlural}`   | `billingEntitlementBalances` | camelCase plural prop (receives the array) |
| `{modelPropSingular}` | `balance`                    | Verbose singular loop variable             |

## When to use table vs list view

| Signal                                          | Use table | Use list view |
| ----------------------------------------------- | --------- | ------------- |
| Multiple numeric columns needing alignment      | Yes       | No            |
| Data only makes sense with column headers       | Yes       | No            |
| Items are self-contained summaries              | No        | Yes           |
| Items need to work in cards, list groups, grids | No        | Yes           |
| Comparing values across rows matters            | Yes       | No            |

## Notes

- Receives an **array**, not a single item — this is the key difference from list/detail views
- Owns the full `<Table>` including headers — the page only owns the section heading and empty state
- The page still handles the empty state check before rendering the table
- Use `style={{ width: N }}` on `<th>` for fixed-width numeric columns
- Right-align numeric columns with `text-end`
- Co-locate formatters (e.g., `formatCents`) in the table file if table-specific
- Use verbose singular names in the map: `balances.map((balance) => ...)`

## Canonical example

`app/domains/billing-entitlement-balance/billing-entitlement-balance-table.jsx`
