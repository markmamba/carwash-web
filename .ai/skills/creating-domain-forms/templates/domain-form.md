# Domain Form

Form component with FormProvider, useForm, and zodResolver.

**Output file:** `app/domains/{domain-model}/{domain-model}-form.jsx`

## Adapt for your resource

- Component name: `OrgCompanyForm` -> your `{DomainModel}Form`
- Schema import: `OrgCompanySchema` -> your schema
- Prop name: `orgCompany` -> your domain model (camelCase)
- Default values: Map from the domain model prop, with fallbacks for create mode
- Submit handler: Always pass `(formState, formHook.setError)` to `onSubmit`
- Fields: Use shared field components; add domain select-search fields for related models
- Size decision: Keep fields inline for small/medium forms. For large forms with multiple Card sections, extract to a `*-form-fields.jsx` file.

## Template — Small/medium form (fields inline)

```jsx
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import TextField from '@/components/forms/text-field'
import SelectField from '@/components/forms/select-field'
import TextareaField from '@/components/forms/textarea-field'
import InputGroupTextField from '@/components/forms/input-group-text-field'
import GeoAreaSearchSelectField from '@/domains/geo-area/geo-area-search-select-field'
import { OrgCompanySchema } from '@/domains/org-company/org-company-schema'

const OrgCompanyForm = ({
  onSubmit  = () => {},
  onCancel  = () => {},
  orgCompany = {},
  geoCountries
}) => {
  const formHook = useForm({
    resolver      : zodResolver(OrgCompanySchema),
    mode          : 'onChange',
    defaultValues : {
      country_id       : orgCompany.country_id || '',
      name             : orgCompany.name || '',
      primary_address  : orgCompany.primary_address || '',
      postal_code      : orgCompany.postal_code || '',
      email            : orgCompany.email || '',
      website_url      : orgCompany.website_url?.replace(/^https?:\/\//, '') || '',
      description      : orgCompany.description || '',
      registration_no  : orgCompany.registration_no || '',
      address_geo_area : orgCompany.address_geo_area || null
    }
  })

  const geoCountryOptions = geoCountries.map((geoCountry) => ({
    value : geoCountry.id,
    label : geoCountry.name
  }))

  const handleFormSubmit = (companyFormState) => {
    return onSubmit(companyFormState, formHook.setError)
  }

  return (
    <FormProvider { ...formHook }>
      <Form onSubmit={ formHook.handleSubmit(handleFormSubmit) }>
        { formHook.formState.errors.root && (
          <Alert variant="danger" className="mb-4">
            { formHook.formState.errors.root.message }
          </Alert>
        ) }

        <Row>
          <Col md={ 6 }>
            <TextField
              name="name"
              label="Company Name"
              required
            />
          </Col>
          <Col md={ 6 }>
            <TextField
              name="registration_no"
              label="Registration Number"
              required
            />
          </Col>
        </Row>

        <Row>
          <Col md={ 6 }>
            <TextField
              name="email"
              label="Email Address"
              autoComplete="email"
              type="email"
              required
            />
          </Col>
          <Col md={ 6 }>
            <SelectField
              name="country_id"
              label="Country"
              options={ geoCountryOptions }
              required
            />
          </Col>
        </Row>

        <Row>
          <Col md={ 6 }>
            <TextareaField
              name="primary_address"
              label="Address"
              required
            />
          </Col>
          <Col md={ 6 }>
            <GeoAreaSearchSelectField
              name="address_geo_area"
              label="Address Area"
              placeholder="Select Address area..."
              formText="Select the area where the company is located"
            />
          </Col>
        </Row>

        <InputGroupTextField
          name="website_url"
          label="Website URL"
          prefix="https://"
        />

        <TextareaField
          name="description"
          label="Description"
          rows={ 3 }
        />

        <div className="d-flex justify-content-end my-3">
          <Button
            type="submit"
            disabled={ formHook.formState.isSubmitting }
            className="me-1"
          >
            {
              formHook.formState.isSubmitting
                ? 'Saving...'
                : 'Save'
            }
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={ onCancel }
            disabled={ isSubmitting }
          >
            { 'Cancel' }
          </Button>
        </div>
      </Form>
    </FormProvider>
  )
}

export default OrgCompanyForm
```

## Template — Large form with separate form fields file

```jsx
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Container, Row, Col, Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import CareersJobFormFields from '@/domains/careers-job/careers-job-form-fields'
import CareersJobListView from '@/domains/careers-job/careers-job-list-view'
import CareersJobDetailView from '@/domains/careers-job/careers-job-detail-view'
import { CareersJobSchema } from '@/domains/careers-job/careers-job-schema'

const CareersJobForm = ({
  careersJob = null,
  onSubmit,
  isCareersJobUpdate = false
}) => {
  const formHook = useForm({
    resolver       : zodResolver(CareersJobSchema(isCareersJobUpdate)),
    mode           : 'onChange',
    reValidateMode : 'onChange',
    defaultValues  : {
      status              : careersJob?.status || 'open',
      company             : careersJob?.company || null,
      taxonomy_category   : careersJob?.taxonomy_category || null,
      title               : careersJob?.title || '',
      employment_type     : careersJob?.employment_type || 'full_time',
      description_summary : careersJob?.description_summary || '',
      description         : careersJob?.description || '',
      pay_type            : careersJob?.pay_type || 'monthly_rate',
      pay_currency        : careersJob?.pay_currency || 'sgd',
      is_pay_shown        : careersJob?.is_pay_shown || true,
      pay_from            : careersJob?.pay_from || null,
      pay_to              : careersJob?.pay_to || null
    }
  })

  const handleCareersJobSubmit = (careersJobFormState) => {
    return onSubmit(careersJobFormState, formHook.setError)
  }

  // Watch all values for live preview panels
  const careersJobFormValues = formHook.watch()

  return (
    <Container>
      <h2 className="mb-4">
        { isCareersJobUpdate ? 'Update Job Posting' : 'Create Job Posting' }
      </h2>

      <FormProvider { ...formHook }>
        <Row>
          <Col md={ 6 }>
            <CareersJobFormFields
              onSubmit={ handleCareersJobSubmit }
              formHook={ formHook }
              isCareersJobUpdate={ isCareersJobUpdate }
            />
          </Col>
          <Col md={ 6 }>
            <div className="sticky-top pt-3">
              <h4>
                { 'List Preview' }
              </h4>
              <ListGroup className="mb-3">
                <ListGroupItem>
                  <CareersJobListView
                    isCareersJobPreview={ true }
                    careersJob={ careersJobFormValues }
                  />
                </ListGroupItem>
              </ListGroup>
              <h4>
                { 'Detail Preview' }
              </h4>
              <Card body>
                <CareersJobDetailView
                  isPreview={ true }
                  careersJob={ careersJobFormValues }
                />
              </Card>
            </div>
          </Col>
        </Row>
      </FormProvider>
    </Container>
  )
}

export default CareersJobForm
```
