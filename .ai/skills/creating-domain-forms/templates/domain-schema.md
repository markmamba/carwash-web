# Domain Schema

Zod validation schema for a domain form.

**Output file:** `app/domains/{domain-model}/{domain-model}-schema.js`

## Adapt for your resource

- Schema export name: `OrgCompanySchema` -> your `{DomainModel}Schema`
- Field names: Match backend permitted params exactly (snake_case)
- Validation messages: Write in plain language for non-technical users
- Domain model selects: Use `z.any().refine((v) => v?.id != null, { message: 'X is required' })` for required object fields, or `z.any().nullable().optional()` for optional. Form stores the full object; submit handler extracts `.id`.
- Cross-field rules: Add `.superRefine()` and extract each rule into a named function
- Dynamic schemas: Export a factory function `(flag) => z.object({...})` when validation depends on runtime state (not just create/update) — e.g., `createPriceSchema(isGig)` where `platform_fee_rate_bps` is required only for gig products

## Template — Static schema (single mode)

```js
import { z } from 'zod'
import { DOMAIN_REGEX, POSTAL_CODE_REGEX } from '@/utils/constants'

export const OrgCompanySchema = z.object({
  country_id      : z.coerce.number().min(1, 'Country is required'),
  name            : z.string().min(2, 'Company name is required'),
  primary_address : z.string()
    .min(1, 'Address is required')
    .min(5, 'Address is too short'),
  postal_code : z.string()
    .min(3, 'Postal code is required')
    .regex(POSTAL_CODE_REGEX, 'Postal code must be numeric'),
  email : z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  website_url : z.string()
    .trim()
    .regex(DOMAIN_REGEX, 'Please enter a valid website URL (e.g., www.jodapp.com or jodapp.com)')
    .or(z.literal('').transform(() => undefined))
    .optional(),
  description      : z.string().max(1000, 'Description is too long').optional().nullable(),
  registration_no  : z.string().min(3, 'Registration number is required'),
  address_geo_area : z
    .object({ id: z.coerce.number() })
    .refine((obj) => obj.id >= 1, { message: 'Please select an address area.' })
})
```

## Template — Dynamic schema with superRefine (create/update modes)

```js
import { z as zod } from 'zod'
import { PAY_CURRENCY, PAY_TYPE } from '@/utils/constants'
import { CAREERS_JOB_EMPLOYMENT_TYPE } from '@/domains/careers-job/careers-job-constant'

// Reusable schema for fields that select a related domain model (company, category, geo area)
// The form stores the full object { id, name } so the option renderer can display it
const defaultDomainModelSchema = zod.object({
  id   : zod.number(),
  name : zod.string()
})

// Validates that a selected domain model is not null and has a valid id
const defaultDomainRefine = (model) => {
  const isValid = model !== null && model.id >= 1
  return isValid
}

// Single-attribute validators for enum select fields
const careersJobEmploymentTypeValidator = (value) => {
  const isValid = CAREERS_JOB_EMPLOYMENT_TYPE.some((type) => type.value === value)
  return isValid
}

const careersJobPayTypeValidator = (value) => {
  const isValid = PAY_TYPE.some((type) => type.value === value)
  return isValid
}

// Cross-field validation: extract each rule into a named function for readability
const careersJobPaySuperRefine = (careersJob, ctx) => {
  const isPayShown = careersJob.is_pay_shown
  const payFrom    = careersJob.pay_from || 0
  const payTo      = careersJob.pay_to   || 0

  if (isPayShown) {
    if (payFrom <= 0) {
      ctx.addIssue({
        code    : 'custom',
        path    : [ 'pay_from' ],
        message : 'Starting pay is required when pay is shown.'
      })
    }
    if (payTo <= 0) {
      ctx.addIssue({
        code    : 'custom',
        path    : [ 'pay_to' ],
        message : 'Ending pay is required when pay is shown.'
      })
    }
  }

  if (payFrom > 0 && payTo > 0 && payFrom >= payTo) {
    ctx.addIssue({
      code    : 'custom',
      path    : ['pay_from'],
      message : 'Starting pay must be less than ending pay.'
    })
  }
}

// Export as function when create/update schemas differ
export const CareersJobSchema = (isCareersJobUpdate) => {
  return (
    zod.object({
      company : defaultDomainModelSchema.nullable().refine(
        defaultDomainRefine,
        { message: 'Select the company posting this job.' }
      ),

      status : isCareersJobUpdate
        ? zod.string()
        : zod.string().optional(),

      taxonomy_category : defaultDomainModelSchema.nullable().refine(
        defaultDomainRefine,
        { message: 'Select a job category for this job.' }
      ),

      title : zod.string()
        .min(1, 'Job title is required')
        .min(6, 'Must be at least 6 characters long.')
        .max(48, 'Maximum of 48 characters.'),

      employment_type : zod.string().refine(
        careersJobEmploymentTypeValidator,
        'Please select the employment type of this job.'
      ),

      description : zod.string()
        .min(1, 'Description is required')
        .min(25, 'Too short. Must be at least 25 characters long.'),

      pay_type     : zod.string().refine(careersJobPayTypeValidator, 'Select a pay schedule.'),
      pay_from     : zod.coerce.number().nonnegative().optional(),
      pay_to       : zod.coerce.number().nonnegative().optional(),
      is_pay_shown : zod.boolean().default(true)

    }).superRefine((careersJob, ctx) => {
      careersJobPaySuperRefine(careersJob, ctx)
    })
  )
}
```
