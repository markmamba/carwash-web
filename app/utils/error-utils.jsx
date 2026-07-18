import { ApiError } from '@/errors/api-error'
import ApiErrorView from '@/components/error-display/api-error-view'

/**
 * Builds a toast config from an API error.
 * @param {unknown} error - Caught API error
 * @param {Object} [options={}]
 * @param {string} [options.defaultMessage] - Fallback message for non-validation errors
 * @returns {Object} Toast config for useToast().showToast()
 */
export function getApiErrorToastConfig(error, options = {}) {
  const defaultMessage = options.defaultMessage || 'Something went wrong'

  if (!(error instanceof ApiError)) {
    return {
      message : defaultMessage,
      type    : 'danger'
    }
  }

  if (error.status === 422) {
    return {
      title   : 'Validation Error',
      message : <ApiErrorView error={ error } />,
      type    : 'danger'
    }
  }

  if (error.status === 0) {
    return {
      title   : 'Connection Error',
      message : 'Could not connect to the server. Check your connection and try again.',
      type    : 'danger'
    }
  }

  return {
    title   : defaultMessage,
    message : error.title || error.message || defaultMessage,
    type    : 'danger'
  }
}

/**
 * Maps API validation errors onto react-hook-form field errors.
 * @param {unknown} error - Caught API error
 * @param {Function} setError - react-hook-form setError function
 * @param {string} [defaultMessage='Something went wrong'] - Root error fallback
 */
export function setApiErrorsToFormFields(error, setError, defaultMessage = 'Something went wrong') {
  if (!(error instanceof ApiError)) {
    setError('root', { type: 'manual', message: defaultMessage })
    return
  }

  if (error.status === 422 && error.messages && Object.keys(error.messages).length > 0) {
    Object.entries(error.messages).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages

      setError(field, { type: 'manual', message })
    })
    return
  }

  if ([404, 500].includes(error.status)) {
    setError('root', { type: 'manual', message: error.title || defaultMessage })
    return
  }

  setError('root', { type: 'manual', message: defaultMessage })
}
