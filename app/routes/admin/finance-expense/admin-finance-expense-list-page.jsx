import { Alert, Table } from 'react-bootstrap'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router'
import { adminFinanceExpensesApi } from '@/api/admin-finance-expenses-api'
import { JodPagination } from '@/components/tables/jod-pagination'
import { FinanceExpenseFilterForm } from '@/domains/finance-expense/finance-expense-filter-form'
import { handleLoaderError } from '@/utils/loader-utils'
import { CurrencyUtils } from '@/utils/currency-utils'
import { formatCivilDate } from '@/utils/date-time-utils'

export const meta = () => ([
  { title: 'Expenses | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export const handle = {
  pageShell: {
    guidanceText: 'Record business expenses from the physical logbook.'
  }
}

export async function clientLoader({ request }) {
  try {
    const url    = new URL(request.url)
    const params = Object.fromEntries(url.searchParams)
    const data   = await adminFinanceExpensesApi.index(params)

    return { expenses: data.expenses, meta: data.meta }
  } catch (error) {
    return handleLoaderError(error, { expenses: [], meta: { last: 1 } })
  }
}

const CLICKABLE_ROW_STYLE = { cursor: 'pointer' }

const AdminFinanceExpenseListPage = () => {
  const { expenses, meta }              = useLoaderData()
  const navigate                        = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' })

  const handlePageChange = (page) => {
    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams)
      nextParams.set('page', page)
      return nextParams
    })
  }

  const handleSearchSubmit = (filterValues) => {
    const sanitized = Object.fromEntries(
      Object.entries(filterValues).filter(([, value]) => value?.trim?.() !== '' && value !== '')
    )

    setSearchParams({
      ...sanitized,
      page: 1
    })
  }

  const handleSearchReset = () => {
    setSearchParams({ page: 1 })
  }

  const handleRowClick = (expense) => {
    navigate(`/admin/finance/expenses/${expense.id}`)
  }

  return (
    <>
      <p className="small text-uppercase fw-semibold text-body-secondary mb-2">
        { 'Search expenses' }
      </p>
      <div className="border rounded-3 p-3 mb-3">
        <FinanceExpenseFilterForm
          searchParams={ searchParams }
          onSubmit={ handleSearchSubmit }
          handleReset={ handleSearchReset }
        />
      </div>

      {
        expenses.length === 0
          ? (
            <Alert
              variant="light"
              className="border mb-0"
            >
              { 'No expenses found.' }
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
                      { 'Category' }
                    </th>
                    <th scope="col">
                      { 'Amount' }
                    </th>
                    <th scope="col">
                      { 'Description' }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    expenses.map((expense) => (
                      <tr
                        key={ expense.id }
                        onClick={ () => handleRowClick(expense) }
                        role="button"
                        style={ CLICKABLE_ROW_STYLE }
                      >
                        <td>
                          { formatCivilDate(expense.expense_date) }
                        </td>
                        <td>
                          { expense.category }
                        </td>
                        <td>
                          { CurrencyUtils.format(expense.amount) }
                        </td>
                        <td>
                          { expense.description || '—' }
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

export default AdminFinanceExpenseListPage
