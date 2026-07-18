import { Alert, Button, Card } from 'react-bootstrap'
import { Link, useLoaderData, useParams } from 'react-router'
import { adminFinanceDailySalesApi } from '@/api/admin-finance-daily-sales-api'
import { FinanceDailySaleDetailView } from '@/domains/finance-daily-sale/finance-daily-sale-detail-view'
import { handleLoaderError } from '@/utils/loader-utils'

export const meta = () => ([
  { title: 'Daily Sale Details | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export const handle = {
  breadcrumb: ({ params }) => ({
    label: `Daily Sale #${params.dailySaleId}`
  }),
  pageShell: {
    title                    : 'Daily sale details',
    description              : 'View daily sale information.',
    guidanceText             : 'View this day\'s sales entry.',
    transformResourceActions : (actions) => actions.map((action) => {
      if (action.label === 'List') return { ...action, end: false }
      return action
    })
  }
}

export async function clientLoader({ params }) {
  try {
    const data = await adminFinanceDailySalesApi.show(params.dailySaleId)
    return { dailySale: data.daily_sale }
  } catch (error) {
    return handleLoaderError(error, { dailySale: null })
  }
}

const AdminFinanceDailySaleDetailPage = () => {
  const { dailySaleId } = useParams()
  const { dailySale }   = useLoaderData()

  if (!dailySale) {
    return (
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <Alert
            variant="warning"
            className="mb-3"
          >
            { 'Daily sale not found for ID ' }
            { dailySaleId }
            { '.' }
          </Alert>
          <Button
            as={ Link }
            to="/admin/finance/daily-sales"
            variant="primary"
          >
            { 'Back to daily sales list' }
          </Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <FinanceDailySaleDetailView dailySale={ dailySale } />
  )
}

export default AdminFinanceDailySaleDetailPage
