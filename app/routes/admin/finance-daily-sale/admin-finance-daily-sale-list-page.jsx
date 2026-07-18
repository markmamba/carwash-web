import { Alert, Table } from 'react-bootstrap'
import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from 'react-router'
import { adminFinanceDailyClosingsApi } from '@/api/admin-finance-daily-closings-api'
import { adminFinanceDailySalesApi } from '@/api/admin-finance-daily-sales-api'
import { JodPagination } from '@/components/tables/jod-pagination'
import { FinanceDailyClosingDaySummary } from '@/domains/finance-daily-closing/finance-daily-closing-day-summary'
import { FinanceDailySaleFilterForm } from '@/domains/finance-daily-sale/finance-daily-sale-filter-form'
import { useToast } from '@/hooks/use-toast'
import { getApiErrorToastConfig, setApiErrorsToFormFields } from '@/utils/error-utils'
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

// API max page_size; day view loads all sales for one date on a single page.
const DAY_VIEW_PAGE_SIZE = 100

export async function clientLoader({ request }) {
  try {
    const url      = new URL(request.url)
    const params   = Object.fromEntries(url.searchParams)
    const saleDate = params.sale_date?.trim?.() || params.sale_date || ''

    const salesParams = saleDate
      ? {
        ...params,
        sale_date : saleDate,
        page      : 1,
        page_size : DAY_VIEW_PAGE_SIZE
      }
      : params

    const data = await adminFinanceDailySalesApi.index(salesParams)

    let dailyClosing           = null
    let dailyClosingLoadFailed = false
    let dayViewHasMoreSales    = false

    if (saleDate) {
      dayViewHasMoreSales = (data.meta?.last || 1) > 1

      try {
        const closingData = await adminFinanceDailyClosingsApi.index({
          closing_date : saleDate,
          page         : 1
        })

        dailyClosing = closingData.daily_closings?.[0] || null
      } catch (closingError) {
        handleLoaderError(closingError, {})
        dailyClosingLoadFailed = true
      }
    }

    return {
      dailySales               : data.daily_sales,
      meta                     : data.meta,
      dailyClosing,
      dailyClosingLoadFailed,
      dayViewHasMoreSales,
      saleDate
    }
  } catch (error) {
    return handleLoaderError(error, {
      dailySales               : [],
      meta                     : { last: 1 },
      dailyClosing             : null,
      dailyClosingLoadFailed   : false,
      dayViewHasMoreSales      : false,
      saleDate                 : ''
    })
  }
}

const CLICKABLE_ROW_STYLE = { cursor: 'pointer' }

const AdminFinanceDailySaleListPage = () => {
  const {
    dailySales,
    meta,
    dailyClosing,
    dailyClosingLoadFailed,
    dayViewHasMoreSales,
    saleDate
  } = useLoaderData()
  const navigate                                     = useNavigate()
  const revalidator                                  = useRevalidator()
  const { showToast }                                = useToast()
  const [searchParams, setSearchParams]              = useSearchParams({ page: '1' })
  const isDayView                                    = Boolean(saleDate)

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

  const handleDailyClosingSubmit = async (values, setError) => {
    try {
      if (dailyClosing) {
        await adminFinanceDailyClosingsApi.update(dailyClosing.id, values)
        showToast({ message: 'Lunch deduction updated', type: 'success' })
      } else {
        await adminFinanceDailyClosingsApi.create(values)
        showToast({ message: 'Lunch deduction saved', type: 'success' })
      }

      revalidator.revalidate()
      return true
    } catch (error) {
      const toastConfig = getApiErrorToastConfig(error, {
        defaultMessage: 'An error occurred while saving the lunch deduction'
      })
      showToast(toastConfig)

      setApiErrorsToFormFields(
        error,
        setError,
        'An error occurred while saving the lunch deduction'
      )

      return false
    }
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

              {
                isDayView
                  ? null
                  : (
                    <JodPagination
                      totalPages={ meta?.last || 1 }
                      currentPage={ Number(searchParams.get('page')) || 1 }
                      onClick={ handlePageChange }
                    />
                  )
              }
            </>
          )
      }

      {
        isDayView && dayViewHasMoreSales
          ? (
            <Alert
              variant="warning"
              className="border mb-3"
            >
              { 'This day has more than 100 sales. Sub-total and net only include the first 100 entries.' }
            </Alert>
          )
          : null
      }

      {
        isDayView
          ? (
            <FinanceDailyClosingDaySummary
              saleDate={ saleDate }
              dailySales={ dailySales }
              dailyClosing={ dailyClosing }
              dailyClosingLoadFailed={ dailyClosingLoadFailed }
              onSubmit={ handleDailyClosingSubmit }
            />
          )
          : null
      }
    </>
  )
}

export default AdminFinanceDailySaleListPage
