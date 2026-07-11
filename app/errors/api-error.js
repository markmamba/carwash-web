import { data } from 'react-router'

export class ApiError extends Error {
  constructor({
    message,
    status,
    status_name,
    messages = {},
    code,
    title,
    debug_values = {},
    server = 'api',
    originalError = null
  }) {
    super(message)
    this.name          = 'ApiError'
    this.status        = status
    this.status_name   = status_name
    this.messages      = messages
    this.code          = code
    this.title         = title
    this.debug_values  = debug_values
    this.server        = server
    this.originalError = originalError
    this.timestamp     = new Date().toISOString()
  }

  static fromBackendResponse(response, originalError = null) {
    return new ApiError({
      status       : response.status,
      status_name  : response.status_name,
      messages     : response.messages,
      code         : response.code,
      title        : response.title,
      debug_values : response.debug_values,
      server       : response.server,
      originalError
    })
  }

  static async fromHttpError(error) {
    try {
      const errorBody = await error.response.json()
      return ApiError.fromBackendResponse(errorBody, error)
    } catch (parseError) {
      if (parseError instanceof SyntaxError) {
        return new ApiError({
          message       : error.response?.statusText || error.message || 'An error occurred',
          status        : error.response?.status || 500,
          status_name   : 'unknown',
          messages      : {},
          code          : 'Errors::UnknownError',
          title         : error.response?.statusText || error.message || 'An error occurred',
          debug_values  : {},
          server        : 'api',
          originalError : error
        })
      }
      throw parseError
    }
  }

  static fromNetworkError(error) {
    return new ApiError({
      message      : 'Network error occurred',
      status       : 0,
      status_name  : 'network_error',
      messages     : {},
      code         : 'Errors::NetworkError',
      title        : 'Network error occurred',
      debug_values : {
        originalMessage : error.message,
        name            : error.name
      },
      server        : 'api',
      originalError : error
    })
  }

  static fromUnknownError(error) {
    return new ApiError({
      message       : error.message || 'Unknown error occurred',
      status        : 500,
      status_name   : 'unknown',
      messages      : {},
      code          : 'Errors::UnknownError',
      title         : error.message || 'Unknown error occurred',
      debug_values  : { originalError: error.name },
      server        : 'api',
      originalError : error
    })
  }

  toResponse() {
    return data({
      name         : this.name,
      message      : this.message,
      status       : this.status,
      status_name  : this.status_name,
      messages     : this.messages,
      code         : this.code,
      title        : this.title,
      debug_values : this.debug_values,
      server       : this.server,
      timestamp    : this.timestamp
    }, {
      status: this.status || 500
    })
  }

  toObject() {
    return {
      name         : this.name,
      message      : this.message,
      status       : this.status,
      status_name  : this.status_name,
      messages     : this.messages,
      code         : this.code,
      title        : this.title,
      debug_values : this.debug_values,
      server       : this.server,
      timestamp    : this.timestamp,
      stack        : this.stack
    }
  }
}
