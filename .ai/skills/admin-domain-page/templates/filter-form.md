# Filter Form

**Output file:** `app/domains/{context}-{resource}/{context}-{resource}-filter-form.jsx`

## Adapt for your resource

- `FinanceDailySaleFilterForm` -> your `{Context}{Resource}FilterForm`
- Field names, labels, and placeholders -> from `AdminsIndexRequest#custom_permitted_params`
- Col sizing must sum to 12 at `md` breakpoint:
  - Primary text field (name): `xs={12} md={4}`
  - Short field (id, status): `xs={6} md={2}`
  - Long field (uuid, email): `xs={6} md={4}`
  - Buttons: `xs={12} md={2}`

## Template

```jsx
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Form, Button, Row, Col } from 'react-bootstrap'
import TextField from '@/components/forms/text-field'

export const FinanceDailySaleFilterForm = ({ searchParams, onSubmit, handleReset }) => {
  const formHook = useForm({
    defaultValues: {
      // One entry per searchable field from AdminsIndexRequest#custom_permitted_params
      name : searchParams.get('name') || ''
    },
    mode: 'onChange'
  })

  useEffect(() => {
    formHook.reset({
      name : searchParams.get('name') || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSearch = (filterValues) => {
    onSubmit(filterValues)
  }

  const handleFormReset = () => {
    formHook.reset({
      name : ''
    })
    handleReset()
  }

  return (
    <Form onSubmit={ formHook.handleSubmit(handleSearch) }>
      <FormProvider { ...formHook }>
        <Row className="align-items-end">
          {/* Repeat Col + TextField for each searchable field */}
          <Col xs={ 12 } md={ 4 }>
            <TextField
              name="name"
              label="Name"
              placeholder="Search by name"
              className="mb-2"
            />
          </Col>
          <Col xs={ 12 } md={ 2 } className="mb-2">
            <div className="d-flex gap-1">
              <Button type="submit" variant="primary">
                { 'Search' }
              </Button>
              <Button type="button" variant="secondary" onClick={ handleFormReset }>
                { 'Reset' }
              </Button>
            </div>
          </Col>
        </Row>
      </FormProvider>
    </Form>
  )
}
```
