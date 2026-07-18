import { useFormContext } from 'react-hook-form'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import CurrencyField from '@/components/forms/currency-field'
import DateField from '@/components/forms/date-field'
import TextField from '@/components/forms/text-field'
import TextareaField from '@/components/forms/textarea-field'
import {
  FINANCE_DAILY_SALE_BUSINESS_SHARE_RATE,
  FINANCE_DAILY_SALE_STAFF_SHARE_RATE
} from '@/domains/finance-daily-sale/finance-daily-sale-constant'
import { CurrencyUtils } from '@/utils/currency-utils'

const calculateSharePreview = (totalAmount, rate) => {
  const numericAmount = Number(totalAmount)

  if (!totalAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    return '—'
  }

  return CurrencyUtils.format((numericAmount * rate).toFixed(2))
}

const FinanceDailySaleFormFields = ({ onSubmit }) => {
  const formHook = useFormContext()

  const watchedTotalAmount = formHook.watch('total_amount')
  const businessSharePreview = calculateSharePreview(
    watchedTotalAmount,
    FINANCE_DAILY_SALE_BUSINESS_SHARE_RATE
  )
  const staffSharePreview = calculateSharePreview(
    watchedTotalAmount,
    FINANCE_DAILY_SALE_STAFF_SHARE_RATE
  )

  return (
    <Form onSubmit={ formHook.handleSubmit(onSubmit) }>
      {
        formHook.formState.errors.root
          ? (
            <Alert
              variant="danger"
              className="mb-4"
            >
              { formHook.formState.errors.root.message }
            </Alert>
          )
          : null
      }

      <div className="h5">
        { 'Sale Details' }
      </div>
      <Card
        body
        className="mb-3"
      >
        <Row>
          <Col md={ 6 }>
            <DateField
              name="sale_date"
              label="Sale Date"
              required
            />
          </Col>
          <Col md={ 6 }>
            <TextField
              name="staff_name"
              label="Staff Name"
              required
            />
          </Col>
        </Row>

        <Row>
          <Col md={ 6 }>
            <TextField
              name="plate_number"
              label="Plate Number"
              placeholder="ABC 1234"
              required
            />
          </Col>
          <Col md={ 6 }>
            <TextField
              name="car_type"
              label="Car Type"
              placeholder="SUV, Sedan, etc."
              required
            />
          </Col>
        </Row>

        <CurrencyField
          name="total_amount"
          label="Total Amount"
          required
          formText="Enter the gross payment from the logbook."
        />

        <TextareaField
          name="notes"
          label="Notes"
          rows={ 3 }
          placeholder="Optional notes about this sale"
        />
      </Card>

      <div className="h5">
        { 'Revenue Split Preview' }
      </div>
      <Card
        body
        className="mb-3"
      >
        <Row>
          <Col md={ 6 }>
            <p className="small text-body-secondary mb-1">
              { 'Business Share (60%)' }
            </p>
            <p className="fw-semibold mb-0">
              { businessSharePreview }
            </p>
          </Col>
          <Col md={ 6 }>
            <p className="small text-body-secondary mb-1">
              { 'Staff Share (40%)' }
            </p>
            <p className="fw-semibold mb-0">
              { staffSharePreview }
            </p>
          </Col>
        </Row>
        <p className="small text-body-secondary mb-0 mt-3">
          { 'These amounts are calculated automatically when you save.' }
        </p>
      </Card>

      <div className="d-flex justify-content-end">
        <Button
          type="submit"
          variant="primary"
          disabled={ formHook.formState.isSubmitting }
        >
          {
            formHook.formState.isSubmitting
              ? 'Saving...'
              : 'Save'
          }
        </Button>
      </div>
    </Form>
  )
}

export default FinanceDailySaleFormFields
