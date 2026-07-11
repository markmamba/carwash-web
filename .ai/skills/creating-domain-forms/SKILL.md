---
name: creating-domain-forms
description: Generates domain form components, zod schemas, and form field layouts under app/domains for react-hook-form, FormProvider, and zodResolver. Use when creating or updating finance resource create/edit forms and validation schemas.
---

# Creating Domain Forms

Generates domain form modules, zod schemas, form field layouts, and domain select-search fields that match existing codebase conventions.

## Prerequisites

Before starting, gather these inputs:

| Input                | Example                                            | How to determine                                    |
| -------------------- | -------------------------------------------------- | --------------------------------------------------- |
| Domain model name    | `careers-job`, `org-company`, `talent-experience`  | Backend bounded context + resource                  |
| Form mode            | Create-only, update-only, or both                  | Which CRUD flows does the page support?             |
| Field list           | `title`, `description`, `employment_type`          | Backend request object permitted params             |
| Domain model selects | `company`, `taxonomy_category`, `address_geo_area` | Fields that select related domain models via search |
| Cross-field rules    | Pay range requires both from/to when shown         | Business rules that span multiple fields            |

## Workflow

Copy this checklist and track progress:

```
- [ ] Step 1: Create the zod schema
- [ ] Step 2: Create the domain form component
- [ ] Step 3: Create form fields layout (large forms only)
- [ ] Step 4: Create domain select-search fields (if needed)
- [ ] Step 5: Verify form integrates with route page submit handler
```

### Step 1: Create the zod schema

**File:** `app/domains/{domain-model}/{domain-model}-schema.js`

Define a zod schema that validates every field the form collects. See [templates/domain-schema.md](templates/domain-schema.md).

Key decisions:

- **Simple string/number fields:** Use `z.string().min(1, '...')` or `z.coerce.number()`
- **Enum selects:** Use `z.string().refine()` with a validator function that checks against the constant array
- **Domain model selects** (legal entity, billing account, taxonomy, geo area, etc.): Form stores the full object, NOT just the ID. Use `z.any().refine((v) => v?.id != null, { message: 'X is required' })` for required, or `z.any().nullable().optional()` for optional. Extract the ID in the submit handler: `entity_id: data.entity?.id`
- **Optional URL fields:** Use `z.string().url().or(z.literal('').transform(() => undefined)).optional()`
- **Cross-field rules:** Use `.superRefine()` on the outer object; extract each rule into a named function
- **Dynamic schemas:** Export a factory function `(flag) => z.object({...})` when validation depends on runtime data — e.g., `createBillingProductPriceSchema(isGig)` when a field becomes required only for certain product types. Use `zodResolver(createSchema(flag))` in `useForm`. Don't use a static export when conditional validation is needed.

### Step 2: Create the domain form component

**File:** `app/domains/{domain-model}/{domain-model}-form.jsx`

The form component owns `useForm`, `FormProvider`, and the submit handoff. See [templates/domain-form.md](templates/domain-form.md).

Key decisions:

- **Small/medium forms** (under ~10 fields, no Card sections): Render fields inline in the form component. No separate `*-form-fields.jsx` file.
- **Large forms** (many fields, multiple Card sections, preview panels): Split field rendering into a `*-form-fields.jsx` file and import it.
- **Submit handoff:** Always call `onSubmit(formState, formHook.setError)` so the route page can map API errors back to fields.
- **Root error alert:** Render `formHook.formState.errors.root` as an `<Alert variant="danger">` above the fields.

### Step 3: Create form fields layout (large forms only)

**File:** `app/domains/{domain-model}/{domain-model}-form-fields.jsx`

Only create this file when the form has multiple Card sections or a side-by-side preview layout. See [templates/domain-form-fields.md](templates/domain-form-fields.md).

The form fields component:

- Reads form state via `useFormContext()`
- Receives `onSubmit` and passes it to `<Form onSubmit={formHook.handleSubmit(onSubmit)}>`
- Uses shared field primitives from `app/components/forms/`
- Uses domain select-search fields from `app/domains/` for related model lookups

### Step 4: Create domain select-search fields (if needed)

**File:** `app/domains/{domain-model}/{domain-model}-search-select-field.jsx` or `{domain-model}-select-field.jsx`

Create this when a form field needs to search an API for options (taxonomy lookups, company search, geo area search). See [templates/domain-select-search-field.md](templates/domain-select-search-field.md).

The domain select-search field:

- Composes `SelectSearchField` from `app/components/forms/select-search-field`
- Manages options/loading via `useState`
- Fetches options via API in `useCallback` + initial `useEffect`
- Shows toast-based error feedback on fetch failure

### Step 5: Verify form integrates with route page

The form component hands off submission via `onSubmit(formState, formHook.setError)`. The route page owns the actual API call, success/error toasts, navigation, and field error mapping.

Verify the consuming route page:

1. Imports the domain form component
2. Defines an `onSubmit` handler that receives `(values, setError)` from the form
3. Uses `setApiErrorsToFormFields(error, setError)` to map 422 errors back to form fields
4. Shows the root error alert rendered by the form (`formHook.formState.errors.root`)

For the complete submit handler pattern (try/catch, toast, redirect, revalidation, modal confirmation), see the `creating-route-pages` skill — specifically `templates/submit-error-flow.md`.

## Rules

### Must do

- Place schemas in the same domain folder as the form: `app/domains/{domain-model}/`
- Use `FormProvider` wrapping the form so nested field components can call `useFormContext()`
- Pass `formHook.setError` to the route page's `onSubmit` callback for API error mapping
- Use `mode: 'onChange'` for `useForm` (matches existing codebase convention)
- Add `reValidateMode: 'onChange'` when using `superRefine` cross-field rules
- Use shared field primitives from `app/components/forms/` -- never rebuild dropdown/input mechanics
- Render root error alert for non-field API errors: `formHook.formState.errors.root`
- Use `getApiErrorToastConfig` from `@/utils/error-utils` for error toasts in select-search fields
- Use colon-aligned key spacing in all object literals
- Write validation messages in plain, simple language (target users are non-technical workers)
- Use `import { z } from 'zod'` or `import { z as zod } from 'zod'` (both are used in the codebase)
- Keep the `useForm`/`useFormContext` box closed (H6): always access via `formHook.*` / `formContext.*` — never destructure the return value. Use `formHook.handleSubmit`, `formHook.formState.isSubmitting`, `formHook.setError`, etc. inline in JSX or pass as named function refs. Exception: it is acceptable to extract a frequently-used value into a named const (`const isSubmitting = formHook.formState.isSubmitting`) when used in multiple places — but never destructure methods.
- Use verbose, full-word names in all iterator callbacks: `(billingLegalEntity) =>`, `(productPrice) =>`, NOT `(le) =>`, `(p) =>`, `(e) =>` (A6 rule — applies to `.map()`, `.forEach()`, `.find()`, `.filter()` etc.)
- Show error toasts in all async operations (API calls, archive/delete actions): never silently swallow errors with an empty `catch {}` (I7/E1 rule)
- For domain-object select fields (legal entity, billing account, taxonomy, etc.): store the full object in form state, use `z.any().refine((v) => v?.id != null, { message: '...' })` in the schema, and extract `.id` only in the submit handler — e.g., `billing_legal_entity_id: data.billing_legal_entity?.id`
- Extract repeated status/condition checks to named boolean variables at the top of the component; never repeat inline (`product.status !== 'archived'`) in multiple JSX locations

### Must not do

- Do not call APIs from form components -- create a dedicated `*-search-select-field.jsx` wrapper that encapsulates the API call, then use that wrapper in the form.
- Do not place schemas or form components in `app/routes/` or `app/components/`
- Do not skip `FormProvider` when the form uses shared field components (they depend on `useFormContext`)
- Do not use `useForm` inside shared field components -- they read from context only
- Do not hardcode domain-specific labels in shared field primitives (`app/components/forms/`)
- Do not duplicate field rendering logic that already exists in shared field components
- Do not mutate the domain model object received as a prop
- Do not ship CTAs or UI controls for backend features that are documented as not yet implemented -- check specs/docs before adding activate/deactivate/manage buttons
- Do not duplicate inline rendering logic (IIFEs, status badge blocks) across multiple files -- extract to a shared component in `app/domains/{domain}/`

## Available shared field components

These live in `app/components/forms/` and are ready to use inside any `FormProvider`:

| Component             | Import                                      | Use for                                                   |
| --------------------- | ------------------------------------------- | --------------------------------------------------------- |
| `TextField`           | `@/components/forms/text-field`             | Text, email, number, password inputs                      |
| `TextareaField`       | `@/components/forms/textarea-field`         | Multi-line text                                           |
| `SelectField`         | `@/components/forms/select-field`           | Static option dropdowns (`[{ value, label }]`)            |
| `SelectSearchField`   | `@/components/forms/select-search-field`    | API-backed searchable dropdowns (use via domain wrappers) |
| `CheckboxField`       | `@/components/forms/checkbox-field`         | Boolean toggles                                           |
| `CheckboxGroupField`  | `@/components/forms/checkbox-group-field`   | Multiple checkbox options                                 |
| `RadioGroupField`     | `@/components/forms/radio-group-field`      | Radio button groups                                       |
| `DateField`           | `@/components/forms/date-field`             | Date inputs                                               |
| `MobileField`         | `@/components/forms/mobile-field`           | Phone number with country code                            |
| `CurrencyField`       | `@/components/forms/currency-field`         | Currency amount inputs                                    |
| `PasswordField`       | `@/components/forms/password-field`         | Password with visibility toggle                           |
| `InputGroupTextField` | `@/components/forms/input-group-text-field` | Text with prefix/suffix (e.g., `https://`)                |
| `UploadField`         | `@/components/forms/upload-field`           | File uploads                                              |
| `PayRangeField`       | `@/components/forms/pay-range-field`        | Pay range from/to                                         |

All shared fields read errors via `getFormFieldError(name, formErrors)` from `@/utils/form-utils`.

## File naming

| File                | Pattern                                                             | Example                            |
| ------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| Schema              | `app/domains/{domain-model}/{domain-model}-schema.js`               | `careers-job-schema.js`            |
| Form                | `app/domains/{domain-model}/{domain-model}-form.jsx`                | `careers-job-form.jsx`             |
| Form fields         | `app/domains/{domain-model}/{domain-model}-form-fields.jsx`         | `careers-job-form-fields.jsx`      |
| Select-search field | `app/domains/{domain-model}/{domain-model}-search-select-field.jsx` | `geo-area-search-select-field.jsx` |
| Select field        | `app/domains/{domain-model}/{domain-model}-select-field.jsx`        | `org-company-select-field.jsx`     |
| Option renderer     | `app/domains/{domain-model}/{domain-model}-option.jsx`              | `geo-area-option.jsx`              |
| Constants           | `app/domains/{domain-model}/{domain-model}-constant.js`             | `careers-job-constant.js`          |
