import { ApiError } from '@/errors/api-error'

/**
 * Returns true when an error represents an unauthenticated admin session.
 * @param {unknown} error - Route or loader error
 * @returns {boolean}
 */
export function isUnauthorizedApiError(error) {
  return error instanceof ApiError && error.status === 401
}

/**
 * Builds the admin login URL, preserving the intended destination.
 * @param {string} pathname - Current path
 * @param {string} [search=''] - Current query string (include leading ?)
 * @returns {string} Login path with redirect_to query param
 */
export function buildAdminLoginRedirectPath(pathname, search = '') {
  const redirectTarget = `${pathname}${search}`

  return `/admin/login?redirect_to=${encodeURIComponent(redirectTarget)}`
}
