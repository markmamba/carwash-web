# Submit and Error Flow

Standalone reference for the submit + error handling pattern used across all segments. Covers success toast + redirect, error toast + field errors, and modal confirmations.

## Core imports

```js
import { useNavigate, useRevalidator } from 'react-router'
import { useToast } from '@/hooks/use-toast'
import { useModal } from '@/hooks/use-modal'
import { getApiErrorToastConfig, setApiErrorsToFormFields } from '@/utils/error-utils'
```

## Pattern 1: Form submit with redirect

Used on create/edit pages. The domain form calls `onSubmit(values, setError)`.

```js
const { showToast } = useToast()
const navigate      = useNavigate()

const handleSubmit = async (values, setError) => {
  try {
    await someApi.create(values)

    showToast({
      message : 'Resource created successfully',
      type    : 'success'
    })

    navigate('/list-path', { replace: true })
  } catch (error) {
    const toastConfig = getApiErrorToastConfig(error, {
      defaultMessage: 'An error occurred while creating the resource'
    })
    showToast(toastConfig)

    setApiErrorsToFormFields(
      error,
      setError,
      'An error occurred while creating the resource'
    )
  }
}
```

### How error mapping works

1. **`getApiErrorToastConfig(error, options)`** — returns a toast config object:
   - 422 errors: title = `'Validation Error'`, renders `ApiErrorView` with field messages
   - Network errors: title = `'Connection Error'`
   - Other errors: title = `options.defaultMessage` or `'Something went wrong'`

2. **`setApiErrorsToFormFields(error, setError, defaultMessage)`** — maps 422 field errors to react-hook-form:
   - 422 with messages: calls `setError(field, { type: 'manual', message })` per field
   - 404/500: calls `setError('root', { type: 'manual', message })`
   - Other: calls `setError('root', { type: 'manual', message: defaultMessage })`

## Pattern 2: Inline submit with revalidation

Used on detail pages where an action mutates data and the page should refresh (e.g., creating a sub-resource).

```js
const { showToast }  = useToast()
const { revalidate } = useRevalidator()

const handleSubmit = async (values, { setError }) => {
  try {
    await someApi.createChild(parentId, values)

    showToast({
      message : 'Child created successfully',
      type    : 'success'
    })

    revalidate()
  } catch (error) {
    showToast(getApiErrorToastConfig(error))
    if (setError) setApiErrorsToFormFields(error, setError)
  }
}
```

Key differences from Pattern 1:
- Uses `revalidate()` instead of `navigate()` — stays on the same page
- The `setError` is optional (destructured from second arg object)

## Pattern 3: Modal confirmation before submit

Used for irreversible actions (apply, delete, status change).

```js
const { showToast }              = useToast()
const { showModal, closeModal }  = useModal()

const handleClickAction = () => {
  showModal({
    title   : 'Confirm Action',
    content : (
      <div>
        <p>
          { 'Are you sure you want to proceed?' }
        </p>
      </div>
    ),
    buttons: {
      confirm: {
        label   : 'Confirm',
        variant : 'primary',
        onClick : () => {
          closeModal()
          handleSubmitAction()
        }
      },
      cancel: {
        label   : 'Cancel',
        variant : 'secondary',
        onClick : closeModal
      }
    }
  })
}

const handleSubmitAction = async () => {
  try {
    await someApi.performAction(resourceId)

    showToast({
      message : 'Action completed successfully',
      type    : 'success'
    })

    revalidator.revalidate()
  } catch (error) {
    const toastConfig = getApiErrorToastConfig(error, {
      defaultMessage: 'An error occurred while performing the action'
    })
    showToast(toastConfig)
  }
}
```

Key points:
- `showModal` displays confirmation; `closeModal` dismisses it
- Confirm button calls `closeModal()` first, then the async handler
- The async handler follows the same try/catch pattern

## Pattern 4: Delete with redirect

```js
const handleDelete = async () => {
  try {
    await someApi.destroy(resourceId)

    showToast({
      message : 'Resource deleted successfully',
      type    : 'success'
    })

    navigate('/list-path', { replace: true })
  } catch (error) {
    showToast(getApiErrorToastConfig(error, {
      defaultMessage: 'Failed to delete resource'
    }))
  }
}
```

## Rules

### Must do

- Always show a toast on both success and failure
- Use `getApiErrorToastConfig` for all error toasts (consistent rendering)
- Use `setApiErrorsToFormFields` when the submit source is a form with `setError`
- Use `navigate(path, { replace: true })` after create to prevent back-button returning to form
- Use `revalidate()` after mutations that should refresh the current page data
- Close modals before starting async operations

### Must not do

- Do not call toasts or navigate inside API modules — only in route page handlers
- Do not swallow errors without user feedback
- Do not skip `setApiErrorsToFormFields` on form submissions — 422 field errors must reach the form
- Do not leave loading state unclosed on error (use `finally` block when tracking `isLoading`)
