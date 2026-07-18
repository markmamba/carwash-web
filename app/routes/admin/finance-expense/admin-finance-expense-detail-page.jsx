import { Alert, Button, Card } from 'react-bootstrap'
import { Link, useLoaderData, useParams } from 'react-router'
import { adminFinanceExpensesApi } from '@/api/admin-finance-expenses-api'
import { FinanceExpenseDetailView } from '@/domains/finance-expense/finance-expense-detail-view'
import { handleLoaderError } from '@/utils/loader-utils'

export const meta = () => ([
  { title: 'Expense Details | Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export const handle = {
  breadcrumb: ({ params }) => ({
    label: `Expense #${params.expenseId}`
  }),
  pageShell: {
    title                    : 'Expense details',
    description              : 'View expense information.',
    guidanceText             : 'View this logbook expense entry.',
    transformResourceActions : (actions) => actions.map((action) => {
      if (action.label === 'List') return { ...action, end: false }
      return action
    })
  }
}

export async function clientLoader({ params }) {
  try {
    const data = await adminFinanceExpensesApi.show(params.expenseId)
    return { expense: data.expense }
  } catch (error) {
    return handleLoaderError(error, { expense: null })
  }
}

const AdminFinanceExpenseDetailPage = () => {
  const { expenseId } = useParams()
  const { expense }     = useLoaderData()

  if (!expense) {
    return (
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <Alert
            variant="warning"
            className="mb-3"
          >
            { 'Expense not found for ID ' }
            { expenseId }
            { '.' }
          </Alert>
          <Button
            as={ Link }
            to="/admin/finance/expenses"
            variant="primary"
          >
            { 'Back to expenses list' }
          </Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <FinanceExpenseDetailView expense={ expense } />
  )
}

export default AdminFinanceExpenseDetailPage
