import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Form, Button, Row, Col } from 'react-bootstrap'
import DateField from '@/components/forms/date-field'

export const FinanceDailySaleFilterForm = ({ searchParams, onSubmit, handleReset }) => {
  const formHook = useForm({
    defaultValues: {
      sale_date: searchParams.get('sale_date') || ''
    },
    mode: 'onChange'
  })

  useEffect(() => {
    formHook.reset({
      sale_date: searchParams.get('sale_date') || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = (filterValues) => {
    onSubmit(filterValues)
  }

  const handleFormReset = () => {
    formHook.reset({
      sale_date: ''
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
              name="sale_date"
              label="Sale Date"
              className="mb-2"
            />
          </Col>
          <Col
            xs={ 12 }
            md={ 2 }
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
