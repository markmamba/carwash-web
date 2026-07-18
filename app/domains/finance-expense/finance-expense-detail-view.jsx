import { Badge, Card, ListGroup } from 'react-bootstrap'
import { Copy, Receipt, User } from 'lucide-react'
import { FINANCE_EXPENSE_STATUS_VARIANTS } from '@/domains/finance-expense/finance-expense-constant'
import { FinanceExpenseService } from '@/domains/finance-expense/finance-expense-service'
import { useToast } from '@/hooks/use-toast'
import { CurrencyUtils } from '@/utils/currency-utils'
import { formatCivilDate, formatDateTime } from '@/utils/date-time-utils'

const TIMESTAMP_FORMAT = {
  day      : '2-digit',
  month    : 'short',
  year     : 'numeric',
  hour     : '2-digit',
  minute   : '2-digit',
  timeZone : 'Asia/Manila'
}

const FinanceExpenseDetailView = ({ expense }) => {
  const { showToast } = useToast()

  const statusVariant = FINANCE_EXPENSE_STATUS_VARIANTS[expense.status] || 'secondary'

  const handleCopy = () => {
    navigator.clipboard.writeText(FinanceExpenseService.copyText(expense)).then(() => {
      showToast({ message: 'Copied to clipboard!', type: 'success' })
    })
  }

  return (
    <Card>
      <Card.Header className="hstack gap-2 bg-secondary text-white">
        <div
          className="d-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded"
          style={{ width: 40, height: 40 }}
        >
          <Receipt
            size={ 24 }
            className="text-white"
          />
        </div>
        <div>
          <div className="fw-semibold">
            { expense.category || 'Expense' }
          </div>
          <div className="small text-white text-opacity-50">
            { formatCivilDate(expense.expense_date) }
          </div>
        </div>
      </Card.Header>

      <ListGroup variant="flush">
        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Status' }
          </div>
          <div>
            <Badge
              bg={ statusVariant }
              className="text-capitalize"
            >
              { expense.status }
            </Badge>
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Expense Date' }
          </div>
          <div>
            { formatCivilDate(expense.expense_date) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Category' }
          </div>
          <div>
            { expense.category || '—' }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Amount' }
          </div>
          <div>
            { CurrencyUtils.format(expense.amount) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Description' }
          </div>
          <div>
            { expense.description || '—' }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Created At' }
          </div>
          <div>
            { formatDateTime(expense.created_at, 'en-PH', TIMESTAMP_FORMAT) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Updated At' }
          </div>
          <div>
            { formatDateTime(expense.updated_at, 'en-PH', TIMESTAMP_FORMAT) }
          </div>
        </ListGroup.Item>

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

      {
        expense.admin_created_by
          ? (
            <>
              <div className="hstack gap-2 fw-semibold bg-secondary-subtle text-body-secondary py-2 px-3">
                <User size={ 18 } />
                { 'Created By' }
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="text-body-secondary small fw-medium">
                    { 'Email' }
                  </div>
                  <div className="fw-medium">
                    { expense.admin_created_by.email }
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </>
          )
          : null
      }
    </Card>
  )
}

export { FinanceExpenseDetailView }
