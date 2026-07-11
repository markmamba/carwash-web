# Domain Form Fields

Form field layout component for large forms with multiple Card sections. Only create this file when the form is large enough to warrant separation.

**Output file:** `app/domains/{domain-model}/{domain-model}-form-fields.jsx`

## Adapt for your resource

- Component name: `CareersJobFormFields` -> your `{DomainModel}FormFields`
- Field imports: Add the shared field components and domain select-search fields you need
- Card sections: Group related fields into `<Card body>` blocks with section headings
- Conditional fields: Use `formHook.watch('field_name')` to show/hide dependent fields
- Submit button: Include it at the bottom with `disabled={formHook.formState.isSubmitting}`

## Template

```jsx
import { useFormContext } from 'react-hook-form'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { CAREERS_JOB_EMPLOYMENT_TYPE, CAREERS_JOB_STATUS } from '@/domains/careers-job/careers-job-constant'
import SelectField from '@/components/forms/select-field'
import TextField from '@/components/forms/text-field'
import TextareaField from '@/components/forms/textarea-field'
import CheckboxField from '@/components/forms/checkbox-field'
import GeoAreaSearchSelectField from '@/domains/geo-area/geo-area-search-select-field'
import OrgCompanySelectField from '@/domains/org-company/org-company-select-field'
import TaxonomyCategorySelectField from '@/domains/taxonomy-category/taxonomy-category-select-field'
import { PAY_CURRENCY, PAY_TYPE } from '@/utils/constants'

const CareersJobFormFields = ({
  onSubmit,
  isCareersJobUpdate = false
}) => {
  const formHook = useFormContext()

  const isCareersJobHasRequirementsChecked = formHook.watch('has_requirements')
  const isCareersJobHasBenefitsChecked     = formHook.watch('has_benefits')

  const careersJobSubmitButtonTitle = isCareersJobUpdate ? 'Update Job' : 'Create Job'

  return (
    <Form onSubmit={ formHook.handleSubmit(onSubmit) }>
      { formHook.formState.errors.root && (
        <Alert variant="danger" className="mb-4">
          { formHook.formState.errors.root.message }
        </Alert>
      ) }

      <div className="h5">
        { 'Overview' }
      </div>
      <Card body className="mb-3">
        { isCareersJobUpdate && (
          <SelectField
            name="status"
            label="Status"
            options={ CAREERS_JOB_STATUS }
            required={ true }
          />
        ) }

        <TextField
          name="title"
          label="Job Title"
          required={ true }
          showCharCount={ true }
          maxLength={ 48 }
        />

        <OrgCompanySelectField
          name="company"
          label="Company"
          placeholder="Select Company..."
          required={ true }
        />

        <SelectField
          name="employment_type"
          label="Employment Type"
          options={ CAREERS_JOB_EMPLOYMENT_TYPE }
          required={ true }
        />

        <TaxonomyCategorySelectField
          name="taxonomy_category"
          label="Job Category"
          placeholder="Select Category..."
          required={ true }
        />

        <TextareaField
          name="description_summary"
          label="Job Description Summary"
          required={ true }
          rows={ 3 }
          showCharCount={ true }
          maxLength={ 200 }
          formText="1-2 sentences describing the job. Shown in job search results."
        />
      </Card>

      <div className="h5">
        { 'Details' }
      </div>
      <Card body className="mb-3">
        <CheckboxField
          name="has_requirements"
          label="Add job requirements"
        />

        { isCareersJobHasRequirementsChecked && (
          <TextareaField
            name="requirements_raw"
            label="Requirements"
            required={ true }
            rows={ 5 }
            placeholder={ 'Food Safety Course\n1+ years of experience in F&B' }
            formText="List each requirement on a new line."
          />
        ) }

        <CheckboxField
          name="has_benefits"
          label="Add job benefits"
        />

        { isCareersJobHasBenefitsChecked && (
          <TextareaField
            name="benefits_raw"
            label="Benefits"
            required={ true }
            rows={ 5 }
            placeholder={ 'Health insurance\nPaid time off' }
            formText="List each benefit on a new line."
          />
        ) }

        <TextareaField
          name="description"
          label="Job Description"
          formText="Provide details about job responsibilities and preferred qualifications."
          rows={ 10 }
          required={ true }
        />
      </Card>

      <div className="h5">
        { 'Address' }
      </div>
      <Card body className="mb-3">
        <GeoAreaSearchSelectField
          name="address_geo_area"
          label="Address Area"
          placeholder="Select Address area..."
          required={ true }
          formText="This is the area where the job is located."
        />

        <TextareaField
          name="location"
          label="Address"
          formText="Full address of where the job will be located at."
          required={ true }
          rows={ 3 }
        />
      </Card>

      <div className="h5">
        { 'Pay' }
      </div>
      <Card body className="mb-3">
        <SelectField
          name="pay_type"
          label="Pay Type"
          options={ PAY_TYPE }
          required={ true }
        />
        <SelectField
          name="pay_currency"
          label="Pay Currency"
          options={ PAY_CURRENCY }
          required={ true }
        />
        <CheckboxField
          name="is_pay_shown"
          label="Pay is shown to applicants"
        />
        <TextField name="pay_from" label="Salary Start From" type="number" />
        <TextField name="pay_to" label="Salary Up To" type="number" />
      </Card>

      <div>
        <Button
          type="submit"
          variant="primary"
          disabled={ formHook.formState.isSubmitting }
          className="float-end"
        >
          { careersJobSubmitButtonTitle }
        </Button>
      </div>
    </Form>
  )
}

export default CareersJobFormFields
```
