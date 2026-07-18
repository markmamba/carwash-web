import { ApiError } from '@/errors/api-error'

/**
 * Standard clientLoader error handler. Re-throws 401 so auth boundaries can redirect to login.
 * @param {unknown} error - Caught loader error
 * @param {Object} fallback - Fallback loader data for non-auth errors
 * @returns {Object} Fallback loader data
 */
export function handleLoaderError(error, fallback) {
  if (error instanceof ApiError && error.status === 401) {
    throw error
  }

  return fallback
}
