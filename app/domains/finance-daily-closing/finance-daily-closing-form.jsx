import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form } from 'react-bootstrap'
import CurrencyField from '@/components/forms/currency-field'
import TextareaField from '@/components/forms/textarea-field'
import { financeDailyClosingSchema } from '@/domains/finance-daily-closing/finance-daily-closing-schema'

const FinanceDailyClosingForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  dailyClosing = {},
  closingDate = ''
}) => {
  const formHook = useForm({
    resolver      : zodResolver(financeDailyClosingSchema),
    mode          : 'onChange',
    defaultValues : {
      closing_date    : dailyClosing.closing_date || closingDate || '',
      lunch_deduction : dailyClosing.lunch_deduction ?? '',
      notes           : dailyClosing.notes || ''
    }
  })

  const handleFormSubmit = (dailyClosingFormState) => {
    return onSubmit(dailyClosingFormState, formHook.setError)
  }

  return (
    <FormProvider { ...formHook }>
      <Form onSubmit={ formHook.handleSubmit(handleFormSubmit) }>
        {
          formHook.formState.errors.root
            ? (
              <Alert
                variant="danger"
                className="mb-3"
              >
                { formHook.formState.errors.root.message }
              </Alert>
            )
            : null
        }

        <input
          type="hidden"
          { ...formHook.register('closing_date') }
        />

        <CurrencyField
          name="lunch_deduction"
          label="Lunch Deduction"
          required
          formText="Enter the total lunch cost for this day."
        />

        <TextareaField
          name="notes"
          label="Notes"
          rows={ 3 }
          placeholder="Optional notes about this closing"
        />

        <div className="d-flex justify-content-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={ onCancel }
            disabled={ formHook.formState.isSubmitting }
          >
            { 'Cancel' }
          </Button>
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
    </FormProvider>
  )
}

export default FinanceDailyClosingForm
