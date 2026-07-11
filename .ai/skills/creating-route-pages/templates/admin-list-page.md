# Admin List Page

Admin list page with `clientLoader`, `handle.pageShell`, search/filter/pagination, and clickable table rows.

**Output file:** `app/routes/admin/finance-{model}/admin-finance-{model}-list-page.jsx`

## Adapt for your resource

- `adminFinanceDailySalesApi` -> your API import
- `FinanceDailySaleFilterForm` -> your filter form import
- `AdminFinanceDailySaleListPage` -> your component name
- `dailySales` / `daily_sales` -> your API response key (plural)
- `dailySale` -> your singular variable name
- `'/admin/finance/daily-sales'` -> your route path
- Table `<th>` and `<td>` cells -> from backend serializer attributes

## Key rules

- Use `<Table>` from react-bootstrap
- Search section: ghost container (`border rounded-3 p-3 mb-3`) above the table
- Pagination: `JodPagination` from `@/components/tables/jod-pagination`
- Empty state: `<Alert variant="light" className="border mb-0">`

## Template

```jsx
import { Alert, Table } from 'react-bootstrap'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router'
import { adminFinanceDailySalesApi } from '@/api/admin-finance-daily-sales-api'
import { JodPagination } from '@/components/tables/jod-pagination'
import { FinanceDailySaleFilterForm } from '@/domains/finance-daily-sale/finance-daily-sale-filter-form'
import { handleLoaderError } from '@/utils/loader-utils'
import { CurrencyUtils } from '@/utils/currency-utils'

export const meta = () => ([
  { title: 'Daily Sales | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export const handle = {
  pageShell: {
    guidanceText: 'Enter logbook entries for each car wash.'
  }
}

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

const CLICKABLE_ROW_STYLE = { cursor: 'pointer' }

const AdminFinanceDailySaleListPage = () => {
  const { dailySales, meta }          = useLoaderData()
  const navigate                      = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' })

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev)
      nextParams.set('page', page)
      return nextParams
    })
  }

  const handleSearchSubmit = (filterValues) => {
    const sanitized = Object.fromEntries(
      Object.entries(filterValues).filter(([, value]) => value?.trim() !== '')
    )

    setSearchParams({
      ...sanitized,
      page: 1
    })
  }

  const handleSearchReset = () => {
    setSearchParams({ page: 1 })
  }

  const handleRowClick = (dailySale) => {
    navigate(`/admin/finance/daily-sales/${dailySale.id}`)
  }

  return (
    <>
      <p className="small text-uppercase fw-semibold text-body-secondary mb-2">
        { 'Search daily sales' }
      </p>
      <div className="border rounded-3 p-3 mb-3">
        <FinanceDailySaleFilterForm
          searchParams={ searchParams }
          onSubmit={ handleSearchSubmit }
          handleReset={ handleSearchReset }
        />
      </div>

      {
        dailySales.length === 0
          ? (
            <Alert
              variant="light"
              className="border mb-0"
            >
              { 'No daily sales found.' }
            </Alert>
          )
          : (
            <>
              <Table
                striped
                hover
                responsive
              >
                <thead>
                  <tr>
                    <th scope="col">
                      { 'Date' }
                    </th>
                    <th scope="col">
                      { 'Gross Sales' }
                    </th>
                    <th scope="col">
                      { 'Net Sales' }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    dailySales.map((dailySale) => (
                      <tr
                        key={ dailySale.id }
                        onClick={ () => handleRowClick(dailySale) }
                        role="button"
                        style={ CLICKABLE_ROW_STYLE }
                      >
                        <td>
                          { dailySale.sale_date }
                        </td>
                        <td>
                          { CurrencyUtils.format(dailySale.gross_sales) }
                        </td>
                        <td>
                          { CurrencyUtils.format(dailySale.net_sales) }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>

              <JodPagination
                totalPages={ meta?.last || 1 }
                currentPage={ Number(searchParams.get('page')) || 1 }
                onClick={ handlePageChange }
              />
            </>
          )
      }
    </>
  )
}

export default AdminFinanceDailySaleListPage
```

## Key points

- **`clientLoader`** — browser handles cookies automatically
- **`handleLoaderError`** — re-throws 401 so admin layout redirects to `/admin/login`
- **No auth HOC** — admin auth is handled by `admin-layout.jsx` loader
- **No `<Container>`** — pages render inside `AdminPageShell` which provides padding
