import ky from 'ky'
import { ApiError } from '@/errors/api-error'

/**
 * Factory that creates a configured Ky instance for making HTTP requests.
 *
 * @param {Object} config
 * @param {string} config.csrfCookieName - Cookie name for CSRF token (e.g. 'ADMIN_CSRF_TOKEN')
 * @param {string} config.refreshPath - API path for token refresh on 401
 * @param {string} [config.prefixUrl] - Base URL override (defaults to VITE_API_CARWASH_URL)
 * @returns {import('ky').KyInstance}
 */
function createApiClient({ csrfCookieName, refreshPath, prefixUrl }) {
  const basePrefixUrl  = prefixUrl || import.meta.env.VITE_API_CARWASH_URL
  let refreshPromise   = null

  function extractCsrfToken(request, isClient) {
    if (isClient) {
      return getCookie(csrfCookieName, document.cookie)
    }

    return getCookie(csrfCookieName, request.headers.get('cookie'))
  }

  function buildRefreshRequestConfig(request) {
    const isClient  = typeof window !== 'undefined'
    const csrfToken = extractCsrfToken(request, isClient)

    const headers = {
      'X-CSRF-TOKEN': csrfToken
    }

    const options = {
      prefixUrl: basePrefixUrl,
      headers
    }

    if (isClient) {
      options.credentials = 'include'
    } else {
      const originalCookie = request.headers.get('cookie')
      if (originalCookie) {
        headers.cookie = originalCookie
      }
    }

    return options
  }

  async function attemptTokenRefresh(request) {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = (async () => {
      try {
        const refreshConfig   = buildRefreshRequestConfig(request)
        const refreshResponse = await ky.patch(refreshPath, refreshConfig)

        return refreshResponse
      } catch (error) {
        console.log('Token refresh failed:', error)
        return false
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  async function handleClientSideRetry(request, options) {
    const { prefixUrl: _prefixUrl, ...retryOptions } = options

    const headers = { ...retryOptions.headers }
    if (!['GET', 'HEAD'].includes(request.method)) {
      headers['X-CSRF-Token'] = getCookie(csrfCookieName, document.cookie)
    }

    return ky(request.url, {
      ...retryOptions,
      method      : request.method,
      headers,
      credentials : 'include',
      _retry      : true
    })
  }

  return ky.create({
    prefixUrl : basePrefixUrl,
    timeout   : 30000,
    headers   : {
      'Content-Type' : 'application/json',
      'Accept'       : 'application/json'
    },
    credentials : 'include',
    hooks       : {
      beforeRequest: [
        (request) => {
          if (!['GET'].includes(request.method)) {
            if (typeof window !== 'undefined') {
              const csrfToken = getCookie(csrfCookieName, document.cookie)
              request.headers.set('X-CSRF-Token', csrfToken)
            }
          }
        }
      ],
      afterResponse: [
        async (request, options, response) => {
          if (response.status === 401 && !options._retry) {
            const refreshSuccess = await attemptTokenRefresh(request)

            if (refreshSuccess) {
              const isClient = typeof window !== 'undefined'

              if (isClient) {
                return handleClientSideRetry(request, options)
              }

              return handleServerSideRetry(request, options, refreshSuccess)
            }
          }
        }
      ],
      beforeError: [
        async (error) => {
          if (error.name === 'HTTPError') {
            throw await ApiError.fromHttpError(error)
          }

          if (error.name === 'TimeoutError' || error.name === 'TypeError') {
            throw ApiError.fromNetworkError(error)
          }

          throw ApiError.fromUnknownError(error)
        }
      ],
      beforeRetry: [
        async ({ error }) => {
          const originalError = error?.originalError
          const status        = originalError.response?.status

          if (status && [401, 403].includes(status)) {
            throw error
          }
        }
      ]
    },
    retry: {
      limit       : 2,
      methods     : ['get', 'put', 'head', 'delete', 'options', 'trace'],
      statusCodes : [408, 413, 429, 500, 502, 503, 504, 521, 522, 524]
    }
  })
}

async function handleServerSideRetry(request, options, refreshSuccess) {
  const setCookieHeaders = refreshSuccess.headers.getSetCookie?.() || []
  const refreshedCookie  = setCookieToCookie(setCookieHeaders)

  const updatedOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Cookie': refreshedCookie
    },
    _retry: true
  }

  const { prefixUrl: _prefixUrl, ...serverRetryOptions } = updatedOptions
  const retryResponse                        = await ky(request.url, {
    ...serverRetryOptions,
    method: request.method
  })
  const data                                 = await retryResponse.json()

  const responseHeaders = new Headers(Object.fromEntries(retryResponse.headers.entries()))

  for (const cookie of setCookieHeaders) {
    responseHeaders.append('Set-Cookie', cookie)
  }

  return new Response(JSON.stringify(data), {
    status     : retryResponse.status,
    statusText : retryResponse.statusText,
    headers    : responseHeaders
  })
}

function getCookie(name, cookieString) {
  if (!cookieString) return undefined

  const rawCookie = cookieString
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split(name + '=')[1]

  return decodeURIComponent(rawCookie)
}

function setCookieToCookie(setCookieHeaders) {
  if (!setCookieHeaders || setCookieHeaders.length === 0) return ''

  const cookies = setCookieHeaders.map((setCookieString) => {
    const parts      = setCookieString.split(';')
    const cookiePart = parts[0].trim()

    return cookiePart
  }).filter((cookie) => cookie.length > 0)

  return cookies.join('; ')
}

/**
 * API client for admin endpoints.
 * Reads ADMIN_CSRF_TOKEN cookie. Refreshes via admins/identities/admins/sessions/current.
 */
export const adminApiClient = createApiClient({
  csrfCookieName : 'ADMIN_CSRF_TOKEN',
  refreshPath    : 'admins/identities/admins/sessions/current',
  prefixUrl      : import.meta.env.VITE_API_CARWASH_URL
})
