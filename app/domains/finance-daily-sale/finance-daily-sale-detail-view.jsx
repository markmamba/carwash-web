import { Badge, Card, ListGroup } from 'react-bootstrap'
import { Car, Copy, User } from 'lucide-react'
import { FINANCE_DAILY_SALE_STATUS_VARIANTS } from '@/domains/finance-daily-sale/finance-daily-sale-constant'
import { FinanceDailySaleService } from '@/domains/finance-daily-sale/finance-daily-sale-service'
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

const FinanceDailySaleDetailView = ({ dailySale }) => {
  const { showToast } = useToast()

  const statusVariant = FINANCE_DAILY_SALE_STATUS_VARIANTS[dailySale.status] || 'secondary'

  const handleCopy = () => {
    navigator.clipboard.writeText(FinanceDailySaleService.copyText(dailySale)).then(() => {
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
          <Car
            size={ 24 }
            className="text-white"
          />
        </div>
        <div>
          <div className="fw-semibold">
            { dailySale.plate_number || 'Daily Sale' }
          </div>
          <div className="small text-white text-opacity-50">
            { formatCivilDate(dailySale.sale_date) }
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
              { dailySale.status }
            </Badge>
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Sale Date' }
          </div>
          <div>
            { formatCivilDate(dailySale.sale_date) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Plate Number' }
          </div>
          <div>
            { dailySale.plate_number || '—' }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Car Type' }
          </div>
          <div>
            { dailySale.car_type || '—' }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Total Amount' }
          </div>
          <div>
            { CurrencyUtils.format(dailySale.total_amount) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Business Share' }
          </div>
          <div>
            { CurrencyUtils.format(dailySale.business_share) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Staff Share' }
          </div>
          <div>
            { CurrencyUtils.format(dailySale.staff_share) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Staff Name' }
          </div>
          <div>
            { dailySale.staff_name || '—' }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Notes' }
          </div>
          <div>
            { dailySale.notes || '—' }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Created At' }
          </div>
          <div>
            { formatDateTime(dailySale.created_at, 'en-PH', TIMESTAMP_FORMAT) }
          </div>
        </ListGroup.Item>

        <ListGroup.Item>
          <div className="text-body-secondary fw-medium small">
            { 'Updated At' }
          </div>
          <div>
            { formatDateTime(dailySale.updated_at, 'en-PH', TIMESTAMP_FORMAT) }
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
        dailySale.admin_created_by
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
                    { dailySale.admin_created_by.email }
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

export { FinanceDailySaleDetailView }
