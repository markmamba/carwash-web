import { Alert, Table } from 'react-bootstrap'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router'
import { adminFinanceDailySalesApi } from '@/api/admin-finance-daily-sales-api'
import { JodPagination } from '@/components/tables/jod-pagination'
import { FinanceDailySaleFilterForm } from '@/domains/finance-daily-sale/finance-daily-sale-filter-form'
import { handleLoaderError } from '@/utils/loader-utils'
import { CurrencyUtils } from '@/utils/currency-utils'
import { formatCivilDate } from '@/utils/date-time-utils'

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
  const { dailySales, meta }            = useLoaderData()
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
                      { 'Plate Number' }
                    </th>
                    <th scope="col">
                      { 'Car Type' }
                    </th>
                    <th scope="col">
                      { 'Total Amount' }
                    </th>
                    <th scope="col">
                      { 'Business Share' }
                    </th>
                    <th scope="col">
                      { 'Staff Share' }
                    </th>
                    <th scope="col">
                      { 'Staff Name' }
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
                          { formatCivilDate(dailySale.sale_date) }
                        </td>
                        <td>
                          { dailySale.plate_number }
                        </td>
                        <td>
                          { dailySale.car_type }
                        </td>
                        <td>
                          { CurrencyUtils.format(dailySale.total_amount) }
                        </td>
                        <td>
                          { CurrencyUtils.format(dailySale.business_share) }
                        </td>
                        <td>
                          { CurrencyUtils.format(dailySale.staff_share) }
                        </td>
                        <td>
                          { dailySale.staff_name }
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
