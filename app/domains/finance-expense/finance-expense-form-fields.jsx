import { useFormContext } from 'react-hook-form'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import CurrencyField from '@/components/forms/currency-field'
import DateField from '@/components/forms/date-field'
import TextField from '@/components/forms/text-field'
import TextareaField from '@/components/forms/textarea-field'

const FinanceExpenseFormFields = ({ onSubmit }) => {
  const formHook = useFormContext()

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
        { 'Expense Details' }
      </div>
      <Card
        body
        className="mb-3"
      >
        <Row>
          <Col md={ 6 }>
            <DateField
              name="expense_date"
              label="Expense Date"
              required
            />
          </Col>
          <Col md={ 6 }>
            <TextField
              name="category"
              label="Category"
              placeholder="Supplies, Utilities, Lunch, etc."
              required
            />
          </Col>
        </Row>

        <CurrencyField
          name="amount"
          label="Amount"
          required
          formText="Enter the expense amount from the logbook."
        />

        <TextareaField
          name="description"
          label="Description"
          rows={ 3 }
          placeholder="Optional details about this expense"
        />
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

export default FinanceExpenseFormFields
