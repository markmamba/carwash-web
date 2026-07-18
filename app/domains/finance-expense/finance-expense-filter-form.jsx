import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Form, Button, Row, Col } from 'react-bootstrap'
import DateField from '@/components/forms/date-field'
import TextField from '@/components/forms/text-field'

export const FinanceExpenseFilterForm = ({ searchParams, onSubmit, handleReset }) => {
  const formHook = useForm({
    defaultValues: {
      expense_date : searchParams.get('expense_date') || '',
      category     : searchParams.get('category') || ''
    },
    mode: 'onChange'
  })

  useEffect(() => {
    formHook.reset({
      expense_date : searchParams.get('expense_date') || '',
      category     : searchParams.get('category') || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = (filterValues) => {
    onSubmit(filterValues)
  }

  const handleFormReset = () => {
    formHook.reset({
      expense_date : '',
      category     : ''
    })
    handleReset()
  }

  return (
    <Form onSubmit={ formHook.handleSubmit(handleSearch) }>
      <FormProvider { ...formHook }>
        <Row className="align-items-end">
          <Col
            xs={ 12 }
            md={ 4 }
          >
            <DateField
              name="expense_date"
              label="Expense Date"
              className="mb-2"
            />
          </Col>
          <Col
            xs={ 12 }
            md={ 4 }
          >
            <TextField
              name="category"
              label="Category"
              placeholder="Search by category"
              className="mb-2"
            />
          </Col>
          <Col
            xs={ 12 }
            md={ 4 }
            className="mb-2"
          >
            <div className="d-flex gap-1">
              <Button
                type="submit"
                variant="primary"
              >
                { 'Search' }
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={ handleFormReset }
              >
                { 'Reset' }
              </Button>
            </div>
          </Col>
        </Row>
      </FormProvider>
    </Form>
  )
}
